import { corsair } from "@/server/corsair";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/utils/auth";

function buildRaw(to: string, subject: string, body: string, threadId?: string): string {
    const message = [
        `To: ${to}`,
        `Subject: ${subject}`,
        `Content-Type: text/plain; charset=utf-8`,
        ``,
        body,
    ].join('\r\n');

    const raw = btoa(message)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    return raw;
}

export async function POST(request: Request) {
    const { to, subject, body, threadId } = await request.json();
    const session = await auth.api.getSession({ headers: await headers() });
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    
      const client = corsair.withTenant(session.user.id);

    const result = await client.gmail.api.messages.send({
        raw: buildRaw(to, subject, body),
        threadId, 
    });

    return NextResponse.json(result);
}