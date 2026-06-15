// Adapter: raw Gmail API shapes → the Email interface the UI consumes.
//
// We avoid leaking Google's payload schema into components, so the dashboard
// stays decoupled from Gmail internals. The adapter is intentionally
// defensive — Gmail headers, snippets, and bodies come back in many shapes
// and we want one canonical Email.

import type { Email, EmailLabel } from "./mock-data";

// ────────────────────────────────────────────────────────────────────────
// Gmail raw types (subset we use)
// ────────────────────────────────────────────────────────────────────────

export interface GmailHeader {
  name?: string;
  value?: string;
}

export interface GmailMessagePartBody {
  data?: string;
  size?: number;
  attachmentId?: string;
  mimeType?: string;
  filename?: string;
}

export interface GmailMessagePart {
  partId?: string;
  mimeType?: string;
  filename?: string;
  body?: GmailMessagePartBody;
  headers?: GmailHeader[];
  parts?: GmailMessagePart[];
}

export interface GmailMessage {
  id: string;
  threadId?: string;
  labelIds?: string[];
  snippet?: string;
  internalDate?: string;
  historyId?: string;
  payload?: GmailMessagePart;
  sizeEstimate?: number;
}

export interface GmailThread {
  id: string;
  historyId?: string;
  messages?: GmailMessage[];
  snippet?: string;
}

export interface GmailLabel {
  id: string;
  name: string;
  type?: string;
  messagesTotal?: number;
  messagesUnread?: number;
}

export interface GmailListResponse {
  messages?: GmailMessage[];
  nextPageToken?: string;
  resultSizeEstimate?: number;
}

// ────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────

const headerValue = (headers: GmailHeader[] | undefined, name: string): string => {
  if (!headers) return "";
  const h = headers.find((x) => x.name?.toLowerCase() === name.toLowerCase());
  return h?.value ?? "";
};

const headerValues = (headers: GmailHeader[] | undefined, name: string): string[] => {
  if (!headers) return [];
  return headers.filter((x) => x.name?.toLowerCase() === name.toLowerCase()).map((x) => x.value ?? "");
};

const decodeBase64Url = (input: string | undefined): string => {
  if (!input) return "";
  // Gmail uses URL-safe base64. Buffer is available in Next.js server & edge
  // runtimes; on the client (this file is shared) we fall back to atob.
  try {
    if (typeof Buffer !== "undefined") {
      const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
      return Buffer.from(normalized, "base64").toString("utf-8");
    }
  } catch {
    /* fall through */
  }
  try {
    const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "===".slice((normalized.length + 3) % 4);
    return atob(padded);
  } catch {
    return "";
  }
};

const stripHtml = (html: string): string =>
  html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

// Walk a multipart payload and return the first usable text body we find.
const extractBody = (payload: GmailMessagePart | undefined): { text: string; html: string } => {
  if (!payload) return { text: "", html: "" };
  const collect = (part: GmailMessagePart | undefined, acc: { text: string; html: string }) => {
    if (!part) return;
    const mime = part.mimeType ?? "";
    const data = part.body?.data;
    if (data) {
      const decoded = decodeBase64Url(data);
      if (mime === "text/plain" && !acc.text) acc.text = decoded;
      else if (mime === "text/html" && !acc.html) acc.html = decoded;
    }
    if (part.parts) part.parts.forEach((p) => collect(p, acc));
  };
  const out = { text: "", html: "" };
  collect(payload, out);
  if (!out.text && out.html) out.text = stripHtml(out.html);
  return out;
};

const collectAttachments = (payload: GmailMessagePart | undefined, depth = 0): NonNullable<Email["attachments"]> => {
  if (!payload || depth > 6) return [];
  const out: NonNullable<Email["attachments"]> = [];
  const filename = payload.filename;
  const attachmentId = payload.body?.attachmentId;
  const size = payload.body?.size ?? 0;
  if (filename && attachmentId) {
    out.push({
      name: filename,
      size: formatBytes(size),
      type: payload.mimeType?.split("/").pop() ?? "file",
      attachmentId,
      messageId: "", // filled by caller if needed
    });
  }
  for (const p of payload.parts ?? []) {
    out.push(...collectAttachments(p, depth + 1));
  }
  return out;
};

export const formatBytes = (bytes: number): string => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n < 10 ? n.toFixed(1) : Math.round(n)} ${units[i]}`;
};

const initialsOf = (name: string): string =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

const displayNameFromAddress = (raw: string): { name: string; email: string } => {
  // "Name <email@host>" or just "email@host"
  const trimmed = raw.trim();
  const m = trimmed.match(/^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/);
  if (m) {
    return { name: (m[1] || m[2]).trim(), email: m[2].trim() };
  }
  return { name: trimmed, email: trimmed };
};

const palette = [
  "oklch(0.7 0.13 258)",
  "oklch(0.7 0.12 300)",
  "oklch(0.72 0.12 160)",
  "oklch(0.74 0.13 80)",
  "oklch(0.7 0.13 30)",
  "oklch(0.72 0.1 220)",
  "oklch(0.7 0.12 190)",
  "oklch(0.74 0.11 340)",
];

const colorFor = (seed: string): string => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return palette[Math.abs(h) % palette.length];
};

const labelIdsToFolder = (labelIds: string[] | undefined): Email["folder"] => {
  const ids = new Set(labelIds ?? []);
  if (ids.has("TRASH")) return "trash";
  if (ids.has("SPAM")) return "spam";
  if (ids.has("DRAFT")) return "drafts";
  if (ids.has("SENT")) return "sent";
  if (ids.has("ARCHIVE") && !ids.has("INBOX")) return "archive";
  return "inbox";
};

const labelIdsToAppLabels = (labelIds: string[] | undefined): EmailLabel[] => {
  const out = new Set<EmailLabel>();
  for (const id of labelIds ?? []) {
    const lower = id.toLowerCase();
    if (lower.includes("work")) out.add("work");
    else if (lower.includes("personal")) out.add("personal");
    else if (lower.includes("finance") || lower.includes("money") || lower.includes("bill")) out.add("finance");
    else if (lower.includes("newsletter") || lower.includes("promotion")) out.add("newsletter");
    else if (lower.includes("travel")) out.add("travel");
    else if (lower.includes("product")) out.add("product");
  }
  return Array.from(out);
};

// Cheap priority heuristic for the badge in the inbox row.
// Real AI priority would call a model — this keeps the UI populated
// when only the raw Gmail payload is available.
const estimatePriority = (m: GmailMessage): number => {
  const labels = m.labelIds ?? [];
  if (labels.includes("IMPORTANT")) return 92;
  if (labels.includes("CATEGORY_PRIMARY")) return 78;
  if (labels.includes("CATEGORY_UPDATES")) return 55;
  const subject = headerValue(m.payload?.headers, "Subject").toLowerCase();
  if (/(invoice|receipt|contract|urgent|asap|important|action required)/i.test(subject)) return 88;
  if (/(newsletter|promo|deal|offer|discount)/i.test(subject)) return 18;
  if (labels.includes("CATEGORY_PROMOTIONS")) return 12;
  return 50;
};

// ────────────────────────────────────────────────────────────────────────
// Public API
// ────────────────────────────────────────────────────────────────────────

/**
 * Convert a Gmail message (from `messages.get` with format=full or metadata)
 * to the Email shape the UI uses. Safe to call on partial responses.
 */
export function gmailMessageToEmail(m: GmailMessage, opts?: { threadPosition?: "first" | "last" }): Email {
  const id = m.id ?? `unknown-${Math.random().toString(36).slice(2)}`;
  const headers = m.payload?.headers ?? [];
  const fromRaw = opts?.threadPosition === "last"
    ? headerValues(headers, "From").slice(-1)[0] ?? headerValue(headers, "From")
    : headerValue(headers, "From");
  const { name: senderName, email: senderEmail } = displayNameFromAddress(fromRaw);
  const subject = headerValue(headers, "Subject") || "(no subject)";
  const toHeader = headerValue(headers, "To");
  const dateHeader = headerValue(headers, "Date");
  const receivedAt = parseDate(m.internalDate, dateHeader);
  const { text } = extractBody(m.payload);
  const body = text || m.snippet || "";
  const preview = m.snippet || body.slice(0, 160);
  const attachments = collectAttachments(m.payload).map((a) => ({
    name: a.name,
    size: a.size,
    type: a.type,
  }));
  const labelIds = m.labelIds ?? [];
  const unread = !labelIds.includes("UNREAD") ? false : true;
  const starred = labelIds.includes("STARRED");
  return {
    id,
    threadId: m.threadId,
    senderName: senderName || senderEmail || "Unknown",
    senderEmail,
    avatarColor: colorFor(senderEmail || senderName || m.id),
    initials: initialsOf(senderName || senderEmail || "?"),
    subject,
    preview,
    body,
    receivedAt,
    unread,
    starred,
    labels: labelIdsToAppLabels(labelIds),
    aiPriority: estimatePriority(m),
    folder: labelIdsToFolder(labelIds),
    attachments: attachments.length > 0 ? attachments : undefined,
    to: toHeader,
  };
}

/**
 * Convert a list response from `messages.list`. We receive only id+threadId
 * in the list payload; the body/snippet comes from a per-message fetch.
 * The caller is expected to call `gmailMessageToEmail` after fetching full
 * messages, or to use `gmailListItemToEmail` to display a minimal row.
 */
export function gmailListItemToEmail(m: GmailMessage): Email {
  return gmailMessageToEmail(m);
}

/**
 * For threads.get → flat list of emails. The "last" sender is the most
 * recent reply; the "first" sender is the original sender.
 */
export function gmailThreadToEmails(t: GmailThread): Email[] {
  if (!t.messages || t.messages.length === 0) return [];
  return t.messages.map((m, i) => {
    const position = i === 0 ? "first" : i === t.messages!.length - 1 ? "last" : "middle";
    const e = gmailMessageToEmail(m, { threadPosition: position });
    return e;
  });
}

// ────────────────────────────────────────────────────────────────────────
// Internals
// ────────────────────────────────────────────────────────────────────────

function parseDate(internalDate?: string, dateHeader?: string): Date {
  // Prefer Gmail's internalDate (ms since epoch) when present.
  if (internalDate) {
    const n = Number(internalDate);
    if (!Number.isNaN(n)) return new Date(n);
  }
  if (dateHeader) {
    const d = new Date(dateHeader);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date();
}
