import { NextResponse } from "next/server";
import { getCorsairWithTenant } from "@/server/corsair";

export async function POST() {
  try {
    const client = await getCorsairWithTenant();
    
    // Trigger Gmail sync by retrieving lists
    await client.gmail.api.messages.list({
      maxResults: 100,
    });

    return NextResponse.json({ ok: true });
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

    await client.gmail.api.messages.list({
      maxResults: 100,
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
