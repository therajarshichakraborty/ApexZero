import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/utils/auth";

export async function GET() {
  const start = Date.now();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return NextResponse.json({
    ms: Date.now() - start,
    hasSession: !!session,
  });
}
