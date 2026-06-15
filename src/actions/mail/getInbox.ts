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


// export async function getFullMessagesByLabel(folder: string, searchQuery?: string) {
//   const client = await getCorsairWithTenant();
  
//   // Base query for the folder
//   let q = "";
//   switch(folder) {
//     case "inbox": q = "in:inbox"; break;
//     case "important": q = "is:important"; break;
//     case "starred": q = "is:starred"; break;
//     case "sent": q = "in:sent"; break;
//     case "drafts": q = "in:drafts"; break;
//     case "archive": q = "-in:inbox -in:trash -in:spam"; break;
//     case "spam": q = "in:spam"; break;
//     case "trash": q = "in:trash"; break;
//   }

//   if (searchQuery) {
//     q = q ? `${q} ${searchQuery}` : searchQuery;
//   }

//   const result = await client.gmail.api.messages.list({
//     q,
//     maxResults: 20,
//   });

//   if (!result.messages) return [];

//   const { gmailMessageToEmail } = await import("@/lib/gmail-adapter");

//   // Fetch full messages concurrently
//   const fullMessages = await Promise.all(
//     result.messages.map((m) =>
//       client.gmail.api.messages.get({ id: m.id!, format: "full" })
//     )
//   );

//   return fullMessages.map((m) => gmailMessageToEmail(m as any));
// }

export async function getFullMessagesByLabel(folder: string, searchQuery?: string) {
  const client = await getCorsairWithTenant();
  
  let q = "";
  switch(folder) {
    case "inbox": q = "in:inbox"; break;
    case "important": q = "is:important"; break;
    case "starred": q = "is:starred"; break;
    case "sent": q = "in:sent"; break;
    case "drafts": q = "in:drafts"; break;
    case "archive": q = "-in:inbox -in:trash -in:spam"; break;
    case "spam": q = "in:spam"; break;
    case "trash": q = "in:trash"; break;
  }

  if (searchQuery) {
    q = q ? `${q} ${searchQuery}` : searchQuery;
  }

  const result = await client.gmail.api.messages.list({
    q,
    maxResults: 20,
  });

  if (!result.messages) return [];

  const { gmailMessageToEmail } = await import("@/lib/gmail-adapter");

  // Fetch metadata in small chunks to avoid triggering Google's rate limits,
  // which causes the googleapis SDK to exponentially backoff for ~30 seconds.
  const metadataMessages = [];
  const chunkSize = 3;
  for (let i = 0; i < result.messages.length; i += chunkSize) {
    const chunk = result.messages.slice(i, i + chunkSize);
    const resolved = await Promise.all(
      chunk.map((m) =>
        client.gmail.api.messages.get({
          id: m.id!,
          format: "full",
          metadataHeaders: ["From", "To", "Subject", "Date"],
        })
      )
    );
    metadataMessages.push(...resolved);
  }

  return metadataMessages.map((m) => gmailMessageToEmail(m as any));
}


export async function getMessage(messageId: string) {
  const client = await getCorsairWithTenant();
  const res = await client.gmail.api.messages.get({
    id: messageId,
    format: 'full',
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
