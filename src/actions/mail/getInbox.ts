"use server";

import { getCorsairWithTenant } from "@/server/corsair";

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

// export async function getFullMessagesByLabel(folder: string, searchQuery?: string) {
//   const client = await getCorsairWithTenant();

//   let q = "";
//   switch (folder) {
//     case "inbox":
//       q = "in:inbox";
//       break;
//     case "important":
//       q = "is:important";
//       break;
//     case "starred":
//       q = "is:starred";
//       break;
//     case "sent":
//       q = "in:sent";
//       break;
//     case "drafts":
//       q = "in:drafts";
//       break;
//     case "archive":
//       q = "-in:inbox -in:trash -in:spam";
//       break;
//     case "spam":
//       q = "in:spam";
//       break;
//     case "trash":
//       q = "in:trash";
//       break;
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

//   // Now that we have debounced the search, we can safely fetch all 20 metadata
//   // headers concurrently without tripping Google's burst rate limits.
//   // const metadataMessages = await Promise.all(
//   //   result.messages.map((m) =>
//   //     client.gmail.api.messages.get({
//   //       id: m.id!,
//   //       format: "metadata",
//   //       metadataHeaders: ["From", "To", "Subject", "Date"],
//   //     }),
//   //   ),
//   // );

//   // getInbox.ts, inside getFullMessagesByLabel
// const metadataMessages = await Promise.all(
//   result.messages.map(async (m, i) => {
//     const t0 = Date.now();
//     const res = await client.gmail.api.messages.get({
//       id: m.id!,
//       format: "metadata",
//       metadataHeaders: ["From", "To", "Subject", "Date"],
//     });
//     console.log(`msg ${i} took ${Date.now() - t0}ms`);
//     return res;
//   })
// );

//   return metadataMessages.map((m) => gmailMessageToEmail(m as any));
// }

// export async function getFullMessagesByLabel(
//   folder: string,
//   searchQuery?: string,
// ) {
//   const totalStart = Date.now();

//   const clientStart = Date.now();
//   const client = await getCorsairWithTenant();
//   console.log("withTenant took", Date.now() - clientStart, "ms");

//   let q = "";

//   switch (folder) {
//     case "inbox":
//       q = "in:inbox";
//       break;
//     case "important":
//       q = "is:important";
//       break;
//     case "starred":
//       q = "is:starred";
//       break;
//     case "sent":
//       q = "in:sent";
//       break;
//     case "drafts":
//       q = "in:drafts";
//       break;
//     case "archive":
//       q = "-in:inbox -in:trash -in:spam";
//       break;
//     case "spam":
//       q = "in:spam";
//       break;
//     case "trash":
//       q = "in:trash";
//       break;
//   }

//   if (searchQuery) {
//     q = q ? `${q} ${searchQuery}` : searchQuery;
//   }

//   const listStart = Date.now();

//   const result = await client.gmail.api.messages.list({
//     q,
//     maxResults: 1,
//   });

//   console.log("messages.list took", Date.now() - listStart, "ms");

//   if (!result.messages) {
//     console.log("TOTAL", Date.now() - totalStart, "ms");
//     return [];
//   }

//   const { gmailMessageToEmail } = await import("@/lib/gmail-adapter");

//   const batchStart = Date.now();

//   const metadataMessages = await Promise.all(
//     result.messages.map(async (m, i) => {
//       const msgStart = Date.now();

//       const res = await client.gmail.api.messages.get({
//         id: m.id!,
//         format: "metadata",
//         metadataHeaders: ["From", "To", "Subject", "Date"],
//       });

//       console.log(`msg ${i} took ${Date.now() - msgStart}ms`);

//       return res;
//     }),
//   );

//   console.log(
//     "metadata batch took",
//     Date.now() - batchStart,
//     "ms",
//   );

//   console.log(
//     "TOTAL getFullMessagesByLabel took",
//     Date.now() - totalStart,
//     "ms",
//   );

//   return metadataMessages.map((m) => gmailMessageToEmail(m as any));
// }


// export async function getFullMessagesByLabel(
//   folder: string,
//   searchQuery?: string,
// ) {
//   const totalStart = Date.now();

//   const clientStart = Date.now();
//   const client = await getCorsairWithTenant();
//   console.log("withTenant took", Date.now() - clientStart, "ms");

//   let q = "";

//   switch (folder) {
//     case "inbox":
//       q = "in:inbox";
//       break;
//     case "important":
//       q = "is:important";
//       break;
//     case "starred":
//       q = "is:starred";
//       break;
//     case "sent":
//       q = "in:sent";
//       break;
//     case "drafts":
//       q = "in:drafts";
//       break;
//     case "archive":
//       q = "-in:inbox -in:trash -in:spam";
//       break;
//     case "spam":
//       q = "in:spam";
//       break;
//     case "trash":
//       q = "in:trash";
//       break;
//   }

//   if (searchQuery) {
//     q = q ? `${q} ${searchQuery}` : searchQuery;
//   }

//   console.log("ORIGINAL QUERY:", q);

//   const listStart = Date.now();

//   // TEST: NO QUERY
//   console.time("gmail-list");
//   const result = await client.gmail.api.messages.list({

//     maxResults: 1,
//   });
// console.timeEnd("gmail-list");
//   console.log("messages.list took", Date.now() - listStart, "ms");

//   if (!result.messages) {
//     console.log("TOTAL getFullMessagesByLabel took", Date.now() - totalStart, "ms");
//     return [];
//   }

//   const { gmailMessageToEmail } = await import("@/lib/gmail-adapter");

//   const batchStart = Date.now();

//   const metadataMessages = await Promise.all(
//     result.messages.map(async (m, i) => {
//       const msgStart = Date.now();

//       const res = await client.gmail.api.messages.get({
//         id: m.id!,
//         format: "metadata",
//         metadataHeaders: ["From", "To", "Subject", "Date"],
//       });

//       console.log(`msg ${i} took ${Date.now() - msgStart}ms`);

//       return res;
//     }),
//   );

//   console.log(
//     "metadata batch took",
//     Date.now() - batchStart,
//     "ms",
//   );

//   console.log(
//     "TOTAL getFullMessagesByLabel took",
//     Date.now() - totalStart,
//     "ms",
//   );

//   return metadataMessages.map((m) => gmailMessageToEmail(m as any));
// }


const FOLDER_QUERIES: Record<string, string> = {
  inbox:     "in:inbox",
  important: "is:important",
  starred:   "is:starred",
  sent:      "in:sent",
  drafts:    "in:drafts",
  archive:   "-in:inbox -in:trash -in:spam",
  spam:      "in:spam",
  trash:     "in:trash",
};

export async function getFullMessagesByLabel(
  folder: string,
  searchQuery?: string,
) {
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
    maxResults: 1, // increase this — you were fetching only 1
    q,
  });
  console.log("messages.list took", Date.now() - listStart, "ms");

  if (!result.messages?.length) return [];

  const { gmailMessageToEmail } = await import("@/lib/gmail-adapter");

  // Fetch all metadata in parallel
  const batchStart = Date.now();
  const metadataMessages = await Promise.all(
    result.messages.map((m:any) =>
      client.gmail.api.messages.get({
        id: m.id!,
        format: "metadata",
        metadataHeaders: ["From", "To", "Subject", "Date"],
      })
    )
  );
  console.log("metadata batch took", Date.now() - batchStart, "ms");
  console.log("TOTAL took", Date.now() - totalStart, "ms");

  return metadataMessages.map((m:any) => gmailMessageToEmail(m as any));
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
