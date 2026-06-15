import { corsair } from "@/server/corsair";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/utils/auth";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = corsair.withTenant(session.user.id);
  const thread = await client.gmail.api.threads.get({
    id: params.id,
    format: "full",
  });

  return NextResponse.json(thread);
}
