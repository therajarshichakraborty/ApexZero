import { corsair } from "@/server/corsair";
import { auth } from "@/utils/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = corsair.withTenant(session.user.id);
  const results = await client.gmail.db.messages.search({
    data: {
      subject: { contains: query },
    },
    limit: 20,
    offset: 0,
  });

  return NextResponse.json(results);
}
