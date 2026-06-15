export type EmailLabel = "work" | "personal" | "finance" | "newsletter" | "travel" | "product";

export interface Email {
  id: string;
  threadId?: string;
  senderName: string;
  senderEmail: string;
  avatarColor: string;
  initials: string;
  subject: string;
  preview: string;
  body: string;
  receivedAt: Date;
  unread: boolean;
  starred: boolean;
  labels: EmailLabel[];
  aiPriority: number;
  folder: "inbox" | "sent" | "drafts" | "archive" | "spam" | "trash";
  attachments?: {
    name: string;
    size: string;
    type: string;
    attachmentId?: string;
    messageId?: string;
  }[];
  to?: string;
}

export function groupByDay(list: Email[]) {
  const now = new Date();
  const startOfDay = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x.getTime();
  };
  const today = startOfDay(now);
  const yesterday = today - 86400_000;

  const groups: Record<"Today" | "Yesterday" | "Earlier", Email[]> = {
    Today: [],
    Yesterday: [],
    Earlier: [],
  };
  for (const e of list) {
    const d = startOfDay(e.receivedAt);
    if (d === today) groups.Today.push(e);
    else if (d === yesterday) groups.Yesterday.push(e);
    else groups.Earlier.push(e);
  }
  return groups;
}

export function formatTime(d: Date) {
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const week = 7 * 86400_000;
  if (now.getTime() - d.getTime() < week) return d.toLocaleDateString([], { weekday: "short" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}
