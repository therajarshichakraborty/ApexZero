"use server";

import { corsair } from "@/server/corsair";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";

export async function getCorsairWithTenant() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  return corsair.withTenant(session.user.id);
}

export async function getInboxMessages() {
  const client = await getCorsairWithTenant();
  return await client.gmail.api.messages.list({
    labelIds: ["INBOX"],
    maxResults: 50,
  });
}

export async function getMessage(messageId: string) {
  const client = await getCorsairWithTenant();
  return await client.gmail.api.messages.get({
    id: messageId,
    format: "full",
  });
}

function buildRaw(to: string, subject: string, body: string): string {
  const message = [
    `To: ${to}`,
    `Subject: ${subject}`,
    `Content-Type: text/plain; charset=utf-8`,
    ``,
    body,
  ].join("\r\n");

  return Buffer.from(message).toString("base64url");
}

export async function sendEmail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const client = await getCorsairWithTenant();
  const raw = buildRaw(to, subject, body);
  return await client.gmail.api.messages.send({
    raw,
  });
}

export async function trashMessage(messageId: string) {
  const client = await getCorsairWithTenant();
  return await client.gmail.api.messages.trash({
    id: messageId,
  });
}

export async function getLabels() {
  const client = await getCorsairWithTenant();
  return await client.gmail.api.labels.list({});
}
