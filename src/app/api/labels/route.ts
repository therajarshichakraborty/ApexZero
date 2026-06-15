import { corsair } from "@/server/corsair";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = corsair.withTenant(session.user.id);
  const result = await client.gmail.api.labels.list({});
  return NextResponse.json(result);
}
