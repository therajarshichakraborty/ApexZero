export type CalEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location?: string;
  attendees?: { name: string; initials: string; color: string }[];
  color: "violet" | "blue" | "amber" | "emerald" | "rose" | "slate";
  kind: "meeting" | "focus" | "review" | "personal";
  aiNote?: string;
};

const today = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const at = (dayOffset: number, h: number, m = 0) => {
  const d = today();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(h, m, 0, 0);
  return d;
};

export const events: CalEvent[] = [
  {
    id: "c1",
    title: "Q4 roadmap sync",
    start: at(0, 9, 30),
    end: at(0, 10, 15),
    location: "Loom · async first",
    color: "violet",
    kind: "meeting",
    attendees: [
      { name: "Elena Park", initials: "EP", color: "oklch(0.72 0.14 30)" },
      { name: "Marcus Liu", initials: "ML", color: "oklch(0.72 0.14 160)" },
    ],
    aiNote: "Elena needs your priority ranking before this. Draft is in your inbox.",
  },
  {
    id: "c2",
    title: "Deep work — virtualizer review",
    start: at(0, 10, 30),
    end: at(0, 12, 30),
    color: "slate",
    kind: "focus",
    aiNote: "2h focus block. Notifications will be muted.",
  },
  {
    id: "c3",
    title: "Lunch w/ Amelia (a16z)",
    start: at(0, 13, 0),
    end: at(0, 14, 0),
    location: "Tartine · Mission",
    color: "amber",
    kind: "personal",
    attendees: [{ name: "Amelia Voss", initials: "AV", color: "oklch(0.72 0.14 60)" }],
  },
  {
    id: "c4",
    title: "Design review · AI panel v3",
    start: at(0, 15, 0),
    end: at(0, 15, 45),
    location: "Figma · Live",
    color: "blue",
    kind: "review",
    attendees: [
      { name: "Sophia Chen", initials: "SC", color: "oklch(0.72 0.14 220)" },
      { name: "Noah Park", initials: "NP", color: "oklch(0.72 0.14 280)" },
    ],
  },
  {
    id: "c5",
    title: "1:1 — Marcus",
    start: at(1, 9, 0),
    end: at(1, 9, 30),
    color: "emerald",
    kind: "meeting",
    attendees: [{ name: "Marcus Liu", initials: "ML", color: "oklch(0.72 0.14 160)" }],
  },
  {
    id: "c6",
    title: "Customer call · Linear",
    start: at(1, 11, 0),
    end: at(1, 11, 45),
    location: "Zoom",
    color: "blue",
    kind: "meeting",
    attendees: [{ name: "Linear team", initials: "LT", color: "oklch(0.72 0.14 280)" }],
  },
  {
    id: "c7",
    title: "Deep work — inbox triage automation",
    start: at(1, 14, 0),
    end: at(1, 16, 0),
    color: "slate",
    kind: "focus",
  },
  {
    id: "c8",
    title: "Investor update draft",
    start: at(2, 9, 30),
    end: at(2, 10, 30),
    color: "rose",
    kind: "focus",
  },
  {
    id: "c9",
    title: "All-hands",
    start: at(2, 11, 0),
    end: at(2, 12, 0),
    location: "HQ · Atrium",
    color: "violet",
    kind: "meeting",
  },
  {
    id: "c10",
    title: "Coffee — Olivia (legal)",
    start: at(3, 10, 0),
    end: at(3, 10, 30),
    color: "amber",
    kind: "personal",
  },
  {
    id: "c11",
    title: "Eng sync",
    start: at(3, 14, 0),
    end: at(3, 14, 30),
    color: "blue",
    kind: "meeting",
  },
  {
    id: "c12",
    title: "Friday review",
    start: at(4, 15, 0),
    end: at(4, 16, 0),
    color: "emerald",
    kind: "review",
  },
];

export const colorTokens: Record<
  CalEvent["color"],
  { bg: string; border: string; text: string; dot: string }
> = {
  violet: {
    bg: "bg-[oklch(0.32_0.08_290/0.35)]",
    border: "border-[oklch(0.7_0.15_290/0.5)]",
    text: "text-[oklch(0.92_0.06_290)]",
    dot: "bg-[oklch(0.72_0.16_290)]",
  },
  blue: {
    bg: "bg-[oklch(0.32_0.08_240/0.35)]",
    border: "border-[oklch(0.7_0.15_240/0.5)]",
    text: "text-[oklch(0.92_0.06_240)]",
    dot: "bg-[oklch(0.72_0.16_240)]",
  },
  amber: {
    bg: "bg-[oklch(0.32_0.08_70/0.35)]",
    border: "border-[oklch(0.74_0.14_70/0.55)]",
    text: "text-[oklch(0.92_0.06_70)]",
    dot: "bg-[oklch(0.78_0.14_70)]",
  },
  emerald: {
    bg: "bg-[oklch(0.32_0.08_160/0.35)]",
    border: "border-[oklch(0.7_0.14_160/0.5)]",
    text: "text-[oklch(0.92_0.06_160)]",
    dot: "bg-[oklch(0.72_0.14_160)]",
  },
  rose: {
    bg: "bg-[oklch(0.32_0.08_15/0.35)]",
    border: "border-[oklch(0.72_0.15_15/0.5)]",
    text: "text-[oklch(0.92_0.06_15)]",
    dot: "bg-[oklch(0.72_0.16_15)]",
  },
  slate: {
    bg: "bg-[oklch(0.28_0.01_260/0.55)]",
    border: "border-[oklch(0.55_0.02_260/0.6)]",
    text: "text-[oklch(0.92_0.01_260)]",
    dot: "bg-[oklch(0.7_0.02_260)]",
  },
};

export function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = x.getDay();
  const diff = (day + 6) % 7;
  x.setDate(x.getDate() - diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function fmtHour(d: Date) {
  const h = d.getHours();
  const m = d.getMinutes();
  const suffix = h >= 12 ? "pm" : "am";
  const hh = ((h + 11) % 12) + 1;
  return m === 0 ? `${hh}${suffix}` : `${hh}:${String(m).padStart(2, "0")}${suffix}`;
}
