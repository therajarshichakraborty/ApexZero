import { NextResponse } from "next/server";
import { getCorsairWithTenant } from "@/server/corsair";

export async function POST() {
  try {
    const client = await getCorsairWithTenant();
    
    // Trigger Gmail list fetch
    const result = await client.gmail.api.messages.list({
      maxResults: 100,
    });

    if (result.messages && result.messages.length > 0) {
      // Sync detailed payloads for these 100 messages in batches
      const batchSize = 15;
      for (let i = 0; i < result.messages.length; i += batchSize) {
        const batch = result.messages.slice(i, i + batchSize);
        await Promise.all(
          batch.map((m: any) =>
            client.gmail.api.messages.get({
              id: m.id,
              format: "full",
            }).catch((err) => {
              console.error(`Failed to sync message ${m.id}:`, err);
            })
          )
        );
      }
    }

    return NextResponse.json({ ok: true, count: result.messages?.length ?? 0 });
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

    const result = await client.gmail.api.messages.list({
      maxResults: 100,
    });

    if (result.messages && result.messages.length > 0) {
      const batchSize = 15;
      for (let i = 0; i < result.messages.length; i += batchSize) {
        const batch = result.messages.slice(i, i + batchSize);
        await Promise.all(
          batch.map((m: any) =>
            client.gmail.api.messages.get({
              id: m.id,
              format: "full",
            }).catch((err) => {
              console.error(`Failed to sync message ${m.id}:`, err);
            })
          )
        );
      }
    }

    return NextResponse.json({ ok: true, count: result.messages?.length ?? 0 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
