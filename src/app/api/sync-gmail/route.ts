import { NextResponse } from "next/server";
import { getCorsairWithTenant } from "@/server/corsair";

async function performSync(client: any) {
  // 1. Get all local message IDs in DB
  const localMessages = await client.gmail.db.messages.search({
    data: {},
    limit: 500,
  });
  const localIds = new Set(localMessages.map((lm: any) => lm.entity_id).filter(Boolean));

  // 2. Fetch the latest active Gmail message IDs across all folders
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

  for (const q of queries) {
    try {
      const res = await client.gmail.api.messages.list({
        maxResults: 50,
        q: q || undefined
      });
      if (res.messages) {
        for (const m of res.messages) {
          if (m.id) activeGmailIds.add(m.id);
        }
      }
    } catch (err) {
      console.error(`Failed to list messages for query "${q}":`, err);
    }
  }

  // 3. Sync details for messages that are not yet in our database
  const idsToSync = Array.from(activeGmailIds).filter(id => !localIds.has(id));
  console.log(`Syncing ${idsToSync.length} new messages to local DB`);

  if (idsToSync.length > 0) {
    const batchSize = 15;
    for (let i = 0; i < idsToSync.length; i += batchSize) {
      const batch = idsToSync.slice(i, i + batchSize);
      await Promise.all(
        batch.map((id) =>
          client.gmail.api.messages.get({
            id,
            format: "full",
          }).catch((err: any) => {
            console.error(`Failed to fetch details for ${id}:`, err);
          })
        )
      );
    }
  }

  // 4. Delete stale messages (present in DB but no longer in the active lists)
  const idsToDelete = Array.from(localIds).filter(id => !activeGmailIds.has(id));
  console.log(`Deleting ${idsToDelete.length} stale messages from local DB`);

  if (idsToDelete.length > 0) {
    await Promise.all(
      idsToDelete.map((id) =>
        client.gmail.db.messages.deleteByEntityId(id).catch((err: any) => {
          console.error(`Failed to delete stale message ${id}:`, err);
        })
      )
    );
  }

  return {
    syncedCount: idsToSync.length,
    deletedCount: idsToDelete.length,
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
