// src/app/api/test-local-db/route.ts
import { NextResponse } from "next/server";
import { corsair } from "@/server/corsair";

export async function GET() {
  try {
    const client = corsair.withTenant("8Q33ei4wihLyUQbrnGLRCMe5aC9CzyK3");
    
    const start = Date.now();
    const messages = await client.gmail.db.messages.search({
      data: {},
      limit: 5,
    });

    return NextResponse.json({
      ms: Date.now() - start,
      count: messages.length,
      sample: messages[0] ?? null,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}