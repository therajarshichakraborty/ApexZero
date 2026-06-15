import { NextResponse } from "next/server";
import { corsair } from "@/server/corsair";

export async function GET() {
  const start = Date.now();

  // Replace with your actual user ID
  const client = corsair.withTenant("8Q33ei4wihLyUQbrnGLRCMe5aC9CzyK3");

  const result = await client.gmail.api.messages.list({
    maxResults: 1,
  });

  return NextResponse.json({
    ms: Date.now() - start,
    count: result.messages?.length ?? 0,
  });
}
