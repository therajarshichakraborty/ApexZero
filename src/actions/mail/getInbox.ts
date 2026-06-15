"use server";

import { getCorsairWithTenant } from "@/server/corsair";

export async function getInboxMessages() {
  const client = await getCorsairWithTenant();
  return await client.gmail.api.messages.list({
    labelIds: ["INBOX"],
    maxResults: 30,
  });
}

const FOLDER_QUERIES: Record<string, string> = {
  inbox: "in:inbox",
  important: "is:important",
  starred: "is:starred",
  sent: "in:sent",
  drafts: "in:drafts",
  archive: "-in:inbox -in:trash -in:spam",
  spam: "in:spam",
  trash: "in:trash",
};

export async function getFullMessagesByLabel(folder: string, searchQuery?: string) {
  const totalStart = Date.now();

  // On cache hit: ~0ms DB work
  // On cache miss: credential loading happens inside here,
  //   including one warm-up messages.list call
  const client = await getCorsairWithTenant();
  console.log("getCorsairWithTenant took", Date.now() - totalStart, "ms");

  let q = FOLDER_QUERIES[folder] ?? "";
  if (searchQuery) q = q ? `${q} ${searchQuery}` : searchQuery;

  // On cache hit this is the FIRST real Gmail call — no DB involved
  // On cache miss this is redundant with the warm-up — see note below
  const listStart = Date.now();
  const result = await client.gmail.api.messages.list({
    /* The size of maxResults is directly poroprtional to the time it takes to fetch the messages , it also depends on the number of labels the user has. */
    maxResults: 5, // increase this — you were fetching only 1
    q,
  });
  console.log("messages.list took", Date.now() - listStart, "ms");

  if (!result.messages?.length) return [];
  const { gmailMessageToEmail } = await import("@/lib/gmail-adapter");

  // Fetch all metadata in parallel
  const batchStart = Date.now();
  const metadataMessages = await Promise.all(
    result.messages.map((m: any) =>
      client.gmail.api.messages.get({
        id: m.id!,
        /* Making format full takes a lot of time rather than using metadataHeaders */
        format: "minimal", /* minimal | full | raw | metadata */
        // metadataHeaders: ["From", "To", "Subject", "Date"],
      }),
    ),
  );
  console.log("metadata batch took", Date.now() - batchStart, "ms");
  console.log("TOTAL took", Date.now() - totalStart, "ms");

  return metadataMessages.map((m: any) => gmailMessageToEmail(m as any));
}

export async function getMessage(messageId: string) {
  const client = await getCorsairWithTenant();
  const res = await client.gmail.api.messages.get({
    id: messageId,
    format: "full",
  });
  const { gmailMessageToEmail } = await import("@/lib/gmail-adapter");
  return gmailMessageToEmail(res as any);
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

export async function toggleStarMessage(messageId: string, star: boolean) {
  const client = await getCorsairWithTenant();
  return await client.gmail.api.messages.modify({
    id: messageId,
    addLabelIds: star ? ["STARRED"] : [],
    removeLabelIds: star ? [] : ["STARRED"],
  });
}

export async function markReadMessage(messageId: string) {
  const client = await getCorsairWithTenant();
  return await client.gmail.api.messages.modify({
    id: messageId,
    removeLabelIds: ["UNREAD"],
  });
}

export async function archiveMessage(messageId: string) {
  const client = await getCorsairWithTenant();
  return await client.gmail.api.messages.modify({
    id: messageId,
    removeLabelIds: ["INBOX"],
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
