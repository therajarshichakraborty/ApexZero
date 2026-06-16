"use server";

import { getCorsairWithTenant } from "@/server/corsair";
import { gmailMessageToEmail } from "@/lib/gmail-adapter";

const FOLDER_LABEL_MAP: Record<string, string> = {
  inbox:     "INBOX",
  important: "IMPORTANT", 
  starred:   "STARRED",
  sent:      "SENT",
  drafts:    "DRAFT",
  spam:      "SPAM",
  trash:     "TRASH",
  archive:   "ARCHIVE",
};

const FOLDER_QUERIES: Record<string, string> = {
  inbox:     "in:inbox",
  important: "is:important",
  starred:   "is:starred",
  sent:      "in:sent",
  drafts:    "in:drafts",
  archive:   "-in:inbox -in:trash -in:spam",
  spam:      "in:spam",
  trash:     "in:trash",
};

async function performFolderSync(
  client: any,
  folder: string,
  listQuery: string,
  searchData: any,
) {
  try {
    const listRes = await client.gmail.api.messages.list({
      maxResults: 20,
      q: listQuery,
    });
    const gmailIds = listRes.messages?.map((m: any) => m.id).filter(Boolean) || [];

    if (gmailIds.length === 0) return;

    // Query current database messages for this query
    const localMessages = await client.gmail.db.messages.search({
      data: searchData,
      limit: 100,
    });
    const localIds = new Set(
      localMessages
        .filter((m: any) => m.entity_id && m.data?.payload?.headers?.length > 0)
        .map((m: any) => m.entity_id)
    );

    const activeIdToDate = new Map<string, number>();

    // Add dates of already cached complete messages
    for (const m of localMessages) {
      if (m.entity_id && m.data?.payload?.headers?.length > 0) {
        const dateVal = m.data?.internalDate;
        activeIdToDate.set(m.entity_id, dateVal ? parseInt(dateVal) : 0);
      }
    }

    // Fetch missing details in "metadata" format
    const missingIds = gmailIds.filter((id: string) => !localIds.has(id));
    const newlyFetched: any[] = [];
    if (missingIds.length > 0) {
      console.log(`[performFolderSync] Syncing ${missingIds.length} new/missing messages for folder "${folder}"`);
      const results = await Promise.all(
        missingIds.map((id: string) =>
          client.gmail.api.messages.get({
            id,
            format: "full",
            //metadataHeaders: ["From", "To", "Subject", "Date"],
          }).catch((err:any) => {
            console.error(`Failed to fetch missing details for ${id}:`, err);
            return null;
          })
        )
      );
      newlyFetched.push(...results.filter(Boolean));
    }

    // Add dates of newly fetched messages
    for (const m of newlyFetched) {
      if (m.id) {
        const dateVal = m.internalDate;
        activeIdToDate.set(m.id, dateVal ? parseInt(dateVal) : 0);
      }
    }

    // Determine sliding-window threshold
    let oldestActiveDate = 0;
    if (gmailIds.length >= 20) {
      const dates = gmailIds
        .map((id: string) => activeIdToDate.get(id))
        .filter((d:any): d is number => d !== undefined && d > 0);
      if (dates.length > 0) {
        oldestActiveDate = Math.min(...dates);
      }
    }

    const activeGmailIdsSet = new Set(gmailIds);
    const staleIds = localMessages
      .filter((m: any) => {
        const entityId = m.entity_id;
        if (!entityId || activeGmailIdsSet.has(entityId)) return false;

        const dateVal = m.data?.internalDate;
        const messageDate = dateVal ? parseInt(dateVal) : 0;
        return messageDate >= oldestActiveDate;
      })
      .map((m: any) => m.entity_id);

    if (staleIds.length > 0) {
      console.log(`[performFolderSync] Refreshing labels for ${staleIds.length} stale messages for folder "${folder}"`);
      await Promise.all(
        staleIds.map(async (id: string) => {
          try {
            await client.gmail.api.messages.get({
              id,
              format: "full",
              //metadataHeaders: ["From", "To", "Subject", "Date"],
            });
          } catch (err: any) {
            console.log(`[performFolderSync] Failed to fetch stale message ${id}, deleting from DB:`, err.message);
            await client.gmail.db.messages.deleteByEntityId(id).catch(() => {});
          }
        })
      );
    }
  } catch (err) {
    console.error(`Failed performFolderSync for folder "${folder}":`, err);
  }
}

export async function getFullMessagesByLabel(
  folder: string,
  searchQuery?: string,
) {
  const start = Date.now();
  const client = await getCorsairWithTenant();
  console.log("getCorsairWithTenant took", Date.now() - start, "ms");

  const dbStart = Date.now();

  try {
    const label = FOLDER_LABEL_MAP[folder];
    const q = FOLDER_QUERIES[folder] || "";
    const listQuery = searchQuery ? (q ? `${q} ${searchQuery}` : searchQuery) : q;

    const searchData: any = {};
    if (searchQuery) {
      searchData.subject = { contains: searchQuery };
    }
    if (label && folder !== "archive") {
      searchData.labelIds = { contains: label };
    }

    // 1. Query the database first
    const localMessages = await client.gmail.db.messages.search({
      data: searchData,
      limit: 20,
    });

    const completeLocalMessages = localMessages.filter((m: any) => m.data?.payload?.headers?.length > 0);

    if (completeLocalMessages.length > 0) {
      console.log(`[getInbox] Found ${completeLocalMessages.length} complete cached messages in DB for "${folder}". Returning immediately.`);

      // Fire and forget sync in background to update DB
      performFolderSync(client, folder, listQuery, searchData).catch((err) => {
        console.error("Background performFolderSync failed:", err);
      });

      const normalized = completeLocalMessages.map((m: any) => normalizeMessage(m));
      normalized.sort((a, b) => b.receivedAt.getTime() - a.receivedAt.getTime());
      console.log("real-time DB query (cached) took", Date.now() - dbStart, "ms", "count:", normalized.length);
      return normalized;
    }

    // 2. Database is empty or has no complete messages, do a foreground sync
    console.log(`[getInbox] No complete cached messages in DB for "${folder}". Performing foreground sync.`);
    await performFolderSync(client, folder, listQuery, searchData);

    const updatedMessages = await client.gmail.db.messages.search({
      data: searchData,
      limit: 20,
    });

    const completeUpdatedMessages = updatedMessages.filter((m: any) => m.data?.payload?.headers?.length > 0);
    const normalized = completeUpdatedMessages.map((m: any) => normalizeMessage(m));
    normalized.sort((a, b) => b.receivedAt.getTime() - a.receivedAt.getTime());
    console.log("real-time DB query (first-sync) took", Date.now() - dbStart, "ms", "count:", normalized.length);
    return normalized;

  } catch (e) {
    console.error("Real-time DB query failed, using cached database fallback:", e);
    
    // Fallback: search database directly without Gmail API call
    try {
      const label = FOLDER_LABEL_MAP[folder];
      const searchData: any = {};
      if (searchQuery) searchData.subject = { contains: searchQuery };
      if (label && folder !== "archive") searchData.labelIds = { contains: label };

      const messages = await client.gmail.db.messages.search({
        data: searchData,
        limit: 20,
        offset: 0,
      });

      const completeMessages = messages.filter((m: any) => m.data?.payload?.headers?.length > 0);
      const normalized = completeMessages.map((m: any) => normalizeMessage(m));
      normalized.sort((a, b) => b.receivedAt.getTime() - a.receivedAt.getTime());
      return normalized;
    } catch (dbErr) {
      console.error("Database fallback failed, fetching live from Gmail API directly:", dbErr);
      return getFromGmailApi(client, folder, searchQuery);
    }
  }
}

// Normalize Corsair entity shape → your email shape
function normalizeMessage(m: any) {
  const data = m.data ?? {};
  const headers = data.payload?.headers ?? [];

  function header(name: string) {
    return headers.find((h: any) => 
      h.name?.toLowerCase() === name.toLowerCase()
    )?.value ?? "";
  }

  // Ensure headers exist for the adapter
  if (!data.payload) data.payload = {};
  if (!data.payload.headers) data.payload.headers = [];
  const adapterHeaders = data.payload.headers;
  
  const ensureHeader = (name: string, value: string) => {
    if (value && !adapterHeaders.some((h: any) => h.name?.toLowerCase() === name.toLowerCase())) {
      adapterHeaders.push({ name, value });
    }
  };
  
  ensureHeader("Subject", data.subject || "");
  ensureHeader("From", data.from || "");
  ensureHeader("To", data.to || "");
  if (data.internalDate) {
    ensureHeader("Date", new Date(parseInt(data.internalDate)).toISOString());
  }

  // Use the adapter to get UI-compatible fields
  const uiEmail = gmailMessageToEmail(data);

  return {
    ...uiEmail,
    // Keep user-requested local DB fields
    id:          data.id ?? m.entity_id,
    threadId:    data.threadId ?? "",
    subject:     header("Subject") || data.subject || "(no subject)",
    from:        header("From")    || data.from    || "",
    to:          header("To")      || data.to      || "",
    date:        header("Date")    || new Date(
                   parseInt(data.internalDate ?? "0")
                 ).toISOString(),
    snippet:     data.snippet ?? "",
    labelIds:    data.labelIds ?? [],
    isUnread:    data.labelIds?.includes("UNREAD") ?? false,
    isStarred:   data.labelIds?.includes("STARRED") ?? false,
    sizeEstimate: data.sizeEstimate ?? 0,
  };
}

// Fallback: original Gmail API path
async function getFromGmailApi(client: any, folder: string, searchQuery?: string) {
  const FOLDER_QUERIES: Record<string, string> = {
    inbox:     "in:inbox",
    important: "is:important",
    starred:   "is:starred",
    sent:      "in:sent",
    drafts:    "in:drafts",
    archive:   "-in:inbox -in:trash -in:spam",
    spam:      "in:spam",
    trash:     "in:trash",
  };

  let q = FOLDER_QUERIES[folder] ?? "";
  if (searchQuery) q = q ? `${q} ${searchQuery}` : searchQuery;

  const result = await client.gmail.api.messages.list({ maxResults: 20, q });
  if (!result.messages?.length) return [];

  const { gmailMessageToEmail: adapterGmailMessageToEmail } = await import("@/lib/gmail-adapter");

  const full = await Promise.all(
    result.messages.map((m: any) =>
      client.gmail.api.messages.get({
        id: m.id!,
        format: "full",
        //metadataHeaders: ["From", "To", "Subject", "Date"],
      })
    )
  );

  return full.map((m: any) => adapterGmailMessageToEmail(m));
}

// Keep these for other parts of your app
export async function getMessage(messageId: string) {
  const client = await getCorsairWithTenant();
  const res = await client.gmail.api.messages.get({
    id: messageId,
    format: "full",
  });
  const { gmailMessageToEmail: adapterGmailMessageToEmail } = await import("@/lib/gmail-adapter");
  return adapterGmailMessageToEmail(res as any);
}

function buildRaw(to: string, subject: string, body: string): string {
  const message = [
    `To: ${to}`,
    `Subject: ${subject}`,
    `Content-Type: text/plain; charset=utf-8`,
    ``,
    body,
  ].join("\r\n");

  return Buffer.from(message).toString("base64url");
}

export async function sendEmail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const client = await getCorsairWithTenant();
  const raw = buildRaw(to, subject, body);
  return await client.gmail.api.messages.send({
    raw,
  });
}

export async function toggleStarMessage(messageId: string, star: boolean) {
  const client = await getCorsairWithTenant();
  return await client.gmail.api.messages.modify({
    id: messageId,
    addLabelIds: star ? ["STARRED"] : [],
    removeLabelIds: star ? [] : ["STARRED"],
  });
}

export async function markReadMessage(messageId: string) {
  const client = await getCorsairWithTenant();
  return await client.gmail.api.messages.modify({
    id: messageId,
    removeLabelIds: ["UNREAD"],
  });
}

export async function archiveMessage(messageId: string) {
  const client = await getCorsairWithTenant();
  return await client.gmail.api.messages.modify({
    id: messageId,
    removeLabelIds: ["INBOX"],
  });
}

export async function trashMessage(messageId: string) {
  const client = await getCorsairWithTenant();
  return await client.gmail.api.messages.trash({
    id: messageId,
  });
}

export async function getLabels() {
  const client = await getCorsairWithTenant();
  return await client.gmail.api.labels.list({});
}
