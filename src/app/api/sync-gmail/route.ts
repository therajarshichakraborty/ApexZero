import { NextResponse } from "next/server";
import { getCorsairWithTenant } from "@/server/corsair";

async function performSync(client: any) {
  // 1. Get local message IDs and dates in DB (up to 1000 messages)
  const localMessages = await client.gmail.db.messages.search({
    data: {},
    limit: 1000,
  });
  const localIdToDate = new Map<string, number>();
  for (const lm of localMessages) {
    if (lm.entity_id) {
      const dateVal = lm.data?.internalDate;
      localIdToDate.set(lm.entity_id, dateVal ? parseInt(dateVal) : 0);
    }
  }
  const localIds = new Set(localIdToDate.keys());

  // 2. Fetch the latest active Gmail message IDs across all folders in parallel
  const queries = [
    "", // latest overall
    "is:important",
    "in:sent",
    "in:draft",
    "is:starred",
    "in:spam",
    "in:trash"
  ];

  const activeGmailIds = new Set<string>();
  const folderToGmailIds = new Map<string, string[]>();

  await Promise.all(
    queries.map(async (q) => {
      try {
        const res = await client.gmail.api.messages.list({
          maxResults: 50,
          q: q || undefined
        });
        const ids = res.messages?.map((m: any) => m.id).filter(Boolean) || [];
        folderToGmailIds.set(q, ids);
        for (const id of ids) {
          activeGmailIds.add(id);
        }
      } catch (err) {
        console.error(`Failed to list messages for query "${q}":`, err);
      }
    })
  );

  const activeIdToDate = new Map<string, number>();

  // Add dates from already cached local messages
  for (const [id, date] of localIdToDate.entries()) {
    if (activeGmailIds.has(id)) {
      activeIdToDate.set(id, date);
    }
  }

  // 3. Sync details for messages that are not yet in our database
  const idsToSync = Array.from(activeGmailIds).filter(id => !localIds.has(id));
  console.log(`Syncing ${idsToSync.length} new messages to local DB`);

  if (idsToSync.length > 0) {
    const batchSize = 15;
    for (let i = 0; i < idsToSync.length; i += batchSize) {
      const batch = idsToSync.slice(i, i + batchSize);
      const results = await Promise.all(
        batch.map((id) =>
          client.gmail.api.messages.get({
            id,
            format: "metadata",
            metadataHeaders: ["From", "To", "Subject", "Date"],
          }).catch((err: any) => {
            console.error(`Failed to fetch details for ${id}:`, err);
            return null;
          })
        )
      );

      for (const res of results) {
        if (res && res.id) {
          const dateVal = res.internalDate;
          activeIdToDate.set(res.id, dateVal ? parseInt(dateVal) : 0);
        }
      }
    }
  }

  // 4. Delete stale messages (using sliding window per query to avoid clearing old history)
  const idsToDelete = new Set<string>();

  for (const q of queries) {
    const gmailIdsForQuery = folderToGmailIds.get(q) || [];
    if (gmailIdsForQuery.length === 0) continue;

    // Find the oldest date in this query's Gmail list
    let oldestActiveDate = 0;
    if (gmailIdsForQuery.length >= 50) {
      const dates = gmailIdsForQuery
        .map(id => activeIdToDate.get(id))
        .filter((d): d is number => d !== undefined && d > 0);
      if (dates.length > 0) {
        oldestActiveDate = Math.min(...dates);
      }
    }

    const gmailIdsSetForQuery = new Set(gmailIdsForQuery);

    for (const lm of localMessages) {
      const entityId = lm.entity_id;
      if (!entityId || gmailIdsSetForQuery.has(entityId)) continue;

      const cachedDate = localIdToDate.get(entityId) || 0;
      if (cachedDate < oldestActiveDate) continue; // outside the active window, don't delete

      const labels = lm.data?.labelIds || [];
      let matchesQuery = false;

      if (q === "") {
        matchesQuery = true;
      } else if (q === "is:important" && labels.includes("IMPORTANT")) {
        matchesQuery = true;
      } else if (q === "in:sent" && labels.includes("SENT")) {
        matchesQuery = true;
      } else if (q === "in:draft" && labels.includes("DRAFT")) {
        matchesQuery = true;
      } else if (q === "is:starred" && labels.includes("STARRED")) {
        matchesQuery = true;
      } else if (q === "in:spam" && labels.includes("SPAM")) {
        matchesQuery = true;
      } else if (q === "in:trash" && labels.includes("TRASH")) {
        matchesQuery = true;
      }

      if (matchesQuery) {
        idsToDelete.add(entityId);
      }
    }
  }

  let actualDeletedCount = 0;
  console.log(`Refreshing/verifying ${idsToDelete.size} stale messages in local DB`);
  if (idsToDelete.size > 0) {
    await Promise.all(
      Array.from(idsToDelete).map(async (id) => {
        try {
          await client.gmail.api.messages.get({
            id,
            format: "full",
            //metadataHeaders: ["From", "To", "Subject", "Date"],
          });
        } catch (err: any) {
          actualDeletedCount++;
          console.error(`Failed to refresh stale message ${id} (possibly deleted from Gmail), deleting:`, err);
          await client.gmail.db.messages.deleteByEntityId(id).catch(() => {});
        }
      })
    );
  }

  return {
    syncedCount: idsToSync.length,
    deletedCount: actualDeletedCount,
    totalActive: activeGmailIds.size
  };
}

export async function POST() {
  try {
    const client = await getCorsairWithTenant();
    const result = await performSync(client);
    return NextResponse.json({ ok: true, ...result });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const useTestTenant = searchParams.get("test") === "true";
    
    let client;
    if (useTestTenant) {
      const { corsair } = await import("@/server/corsair");
      client = corsair.withTenant("8Q33ei4wihLyUQbrnGLRCMe5aC9CzyK3");
    } else {
      client = await getCorsairWithTenant();
    }

    const result = await performSync(client);
    return NextResponse.json({ ok: true, ...result });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
