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

    // Build DB search query
    const searchData: any = {};
    if (searchQuery) {
      searchData.subject = { contains: searchQuery };
    }
    
    // Direct DB label filtering for non-archive folders
    if (label && folder !== "archive") {
      searchData.labelIds = { contains: label };
    }

    // Query local Corsair DB
    const messages = await client.gmail.db.messages.search({
      data: searchData,
      limit: folder === "archive" ? 100 : 20,
      offset: 0,
    });

    console.log("local DB took", Date.now() - dbStart, "ms", "count:", messages.length);
    console.log("TOTAL took", Date.now() - start, "ms");

    if (!messages.length) {
      // If local DB is empty, fall back to Gmail API
      return getFromGmailApi(client, folder, searchQuery);
    }

    // Client-side filtering only needed for archive (which doesn't have a positive system label)
    const filtered = folder === "archive"
      ? messages.filter((m: any) => {
          const ids = m.data?.labelIds ?? [];
          return !ids.includes("INBOX") && !ids.includes("TRASH") && !ids.includes("SPAM");
        }).slice(0, 50)
      : messages;

    const normalized = filtered.map((m: any) => normalizeMessage(m));

    // Sort descending chronologically by date
    normalized.sort((a, b) => b.receivedAt.getTime() - a.receivedAt.getTime());

    return normalized;

  } catch (e) {
    console.error("local DB failed, falling back to API:", e);
    // Fallback to Gmail API if local DB fails
    return getFromGmailApi(client, folder, searchQuery);
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
        metadataHeaders: ["From", "To", "Subject", "Date"],
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
