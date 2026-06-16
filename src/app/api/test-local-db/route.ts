// src/app/api/test-local-db/route.ts
import { NextResponse } from "next/server";
import { corsair, getCorsairWithTenant } from "@/server/corsair";

export async function GET() {
  try {
    const client = corsair.withTenant("8Q33ei4wihLyUQbrnGLRCMe5aC9CzyK3");
    
    const messages = await client.gmail.db.messages.search({
      data: {},
      limit: 10,
    });

    const completeCount = messages.filter((m: any) => m.data?.payload?.headers?.length > 0).length;

    return NextResponse.json({
      testTenantCount: messages.length,
      testTenantCompleteCount: completeCount,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}