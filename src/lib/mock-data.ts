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
  attachments?: { name: string; size: string; type: string }[];
  to?: string;
}

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

const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const hours = (h: number) => new Date(Date.now() - h * 3600_000);

const seeds: Omit<Email, "id" | "avatarColor" | "initials">[] = [
  {
    senderName: "Elena Park",
    senderEmail: "elena@stripe.com",
    subject: "Q4 platform roadmap — feedback by Friday",
    preview:
      "Hey — I've put together the draft of the Q4 platform roadmap. Would love your thoughts on the prioritization, especially around the billing migration…",
    body: `Hi,\n\nI've put together the draft of the Q4 platform roadmap. There are three threads I'd like your input on:\n\n1. **Billing migration** — moving from the legacy ledger to the unified events pipeline. Estimated 6 engineering weeks.\n2. **Identity unification** — collapsing the three auth surfaces into one. This unblocks SSO for enterprise.\n3. **Internal tooling** — investing one engineer-month into the support console.\n\nIf we can lock priorities by Friday, we'll have a clean kickoff Monday.\n\nThanks,\nElena`,
    receivedAt: hours(0.3),
    unread: true,
    starred: true,
    labels: ["work"],
    aiPriority: 96,
    folder: "inbox",
    attachments: [{ name: "Q4-roadmap.pdf", size: "1.2 MB", type: "pdf" }],
  },
  {
    senderName: "Linear",
    senderEmail: "updates@linear.app",
    subject: "Your weekly cycle review is ready",
    preview:
      "This cycle, your team closed 47 issues across 3 projects. Velocity is up 12% from last cycle. Top contributor: Marcus.",
    body: `Your weekly cycle review is ready.\n\nThis cycle the team closed **47 issues** across 3 projects.\nVelocity is up **12%** from last cycle.\n\nTop contributor: Marcus Liu.\nMost-touched project: Inbox 2.0.\n\nView the full report in Linear.`,
    receivedAt: hours(2),
    unread: true,
    starred: false,
    labels: ["product"],
    aiPriority: 62,
    folder: "inbox",
  },
  {
    senderName: "Marcus Liu",
    senderEmail: "marcus@corsior.com",
    subject: "Re: Inbox virtualization — benchmarks attached",
    preview:
      "Numbers look great. We're seeing ~3.2ms render on 10k messages. I think we can ship this on Tuesday if review goes smoothly…",
    body: `Numbers look great.\n\nWe're seeing **~3.2ms** render on 10k messages with the new virtualizer. Memory footprint dropped from 84MB to 31MB on the worst-case thread.\n\nI think we can ship this on Tuesday if review goes smoothly. PR is up.\n\n— M`,
    receivedAt: hours(3.5),
    unread: false,
    starred: true,
    labels: ["work", "product"],
    aiPriority: 88,
    folder: "inbox",
    attachments: [{ name: "benchmarks.csv", size: "18 KB", type: "csv" }],
  },
  {
    senderName: "Sophia Chen",
    senderEmail: "sophia.chen@figma.com",
    subject: "Design review: AI assistant panel v3",
    preview:
      "Pushed v3 last night. The streaming bubble has a new resting state and the suggested-replies chip got a quieter treatment…",
    body: `Pushed v3 last night.\n\nThe streaming bubble has a new resting state — softer shadow, slightly tighter line-height. The suggested-replies chip got a quieter treatment so it stops fighting the message column for attention.\n\nLink in Figma. Comments welcome before Thursday's review.`,
    receivedAt: hours(6),
    unread: true,
    starred: false,
    labels: ["product"],
    aiPriority: 84,
    folder: "inbox",
  },
  {
    senderName: "Notion",
    senderEmail: "team@notion.so",
    subject: "Your workspace summary",
    preview: "12 pages updated this week. 3 comments awaiting your reply.",
    body: `Workspace summary\n\n12 pages updated this week. 3 comments awaiting your reply.`,
    receivedAt: hours(8),
    unread: false,
    starred: false,
    labels: ["newsletter"],
    aiPriority: 22,
    folder: "inbox",
  },
  {
    senderName: "Amelia Roy",
    senderEmail: "amelia@a16z.com",
    subject: "Intro — would love to chat next week",
    preview:
      "James spoke highly of what you're building. Free for a 30-min call Wed or Thu? I'd love to hear how you're thinking about distribution…",
    body: `Hi —\n\nJames spoke highly of what you're building. Free for a 30-min call Wed or Thu?\n\nI'd love to hear how you're thinking about distribution for an AI-native client in a category as entrenched as email.\n\nBest,\nAmelia`,
    receivedAt: hours(11),
    unread: true,
    starred: true,
    labels: ["work"],
    aiPriority: 92,
    folder: "inbox",
  },
  {
    senderName: "Chase",
    senderEmail: "no-reply@chase.com",
    subject: "Your October statement is available",
    preview: "Your statement for the period ending Oct 31 is now available in your account.",
    body: `Your statement for the period ending **Oct 31** is now available in your account.\n\nSign in to view or download.`,
    receivedAt: hours(20),
    unread: false,
    starred: false,
    labels: ["finance"],
    aiPriority: 40,
    folder: "inbox",
  },
  {
    senderName: "Hiroshi Tanaka",
    senderEmail: "h.tanaka@kyotodesign.jp",
    subject: "Re: Workshop in Kyoto, March",
    preview:
      "Confirmed for March 14–16. I've reserved the studio in Gion. The cherry blossoms should be just opening — perfect light for the photos…",
    body: `Confirmed for March 14–16.\n\nI've reserved the studio in Gion. The cherry blossoms should be just opening — perfect light for the photos we discussed.\n\nLet me know if you'd like me to arrange the ryokan as well.\n\nBest,\nHiroshi`,
    receivedAt: hours(26),
    unread: false,
    starred: true,
    labels: ["personal", "travel"],
    aiPriority: 70,
    folder: "inbox",
  },
  {
    senderName: "Vercel",
    senderEmail: "billing@vercel.com",
    subject: "Invoice #2476 — paid",
    preview: "Thanks — your November invoice has been paid. $480.00.",
    body: `Your November invoice has been paid.\n\nAmount: **$480.00**\nMethod: Visa ending 4242\n\nDownload your receipt from the dashboard.`,
    receivedAt: hours(29),
    unread: false,
    starred: false,
    labels: ["finance"],
    aiPriority: 30,
    folder: "inbox",
  },
  {
    senderName: "Priya Mehta",
    senderEmail: "priya@verticalstudio.com",
    subject: "Brand exploration — round two",
    preview:
      "Attached three directions. I think direction B threads the needle between premium and approachable best…",
    body: `Attached three directions.\n\nI think **direction B** threads the needle between premium and approachable best. The wordmark feels confident without trying too hard, and the secondary palette holds up beautifully in both light and dark.\n\nHappy to walk through tomorrow.\n\n— Priya`,
    receivedAt: hours(34),
    unread: true,
    starred: false,
    labels: ["work"],
    aiPriority: 78,
    folder: "inbox",
    attachments: [
      { name: "corsior-brand-r2.pdf", size: "8.4 MB", type: "pdf" },
      { name: "wordmark-explorations.png", size: "2.1 MB", type: "image" },
    ],
  },
  {
    senderName: "GitHub",
    senderEmail: "noreply@github.com",
    subject: "Security alert: new sign-in to your account",
    preview: "A new sign-in to your account from San Francisco, CA.",
    body: `A new sign-in to your account from San Francisco, CA.\n\nIf this was you, no action is needed.`,
    receivedAt: hours(38),
    unread: false,
    starred: false,
    labels: ["work"],
    aiPriority: 55,
    folder: "inbox",
  },
  {
    senderName: "Olivia Bennett",
    senderEmail: "olivia@bennettlaw.co",
    subject: "Contract review — turnaround Tuesday",
    preview:
      "I've finished my pass on the SOW. Two small comments on IP assignment, otherwise we're good to countersign…",
    body: `I've finished my pass on the SOW.\n\nTwo small comments on IP assignment, otherwise we're good to countersign on Tuesday.\n\nLet me know if you'd like to hop on a call.\n\nBest,\nOlivia`,
    receivedAt: hours(50),
    unread: false,
    starred: false,
    labels: ["work"],
    aiPriority: 74,
    folder: "inbox",
  },
  {
    senderName: "Sarah Jenkins",
    senderEmail: "sarah@designops.co",
    subject: "Final files for mobile onboarding",
    preview: "Hi Sarah — Here are the final assets we agreed on for the mobile onboarding flow...",
    body: `Hi Sarah,\n\nHere are the final SVG assets we agreed on for the mobile onboarding flow. I've optimized them, so they should be extremely light.\n\nLet me know if you need any adjustments or different formats.\n\nThanks,\nAlex`,
    receivedAt: hours(4),
    unread: false,
    starred: false,
    labels: ["work"],
    aiPriority: 45,
    folder: "sent",
  },
  {
    senderName: "David Miller",
    senderEmail: "david@miller-investments.com",
    subject: "Pitch deck update & financial models",
    preview: "Hi David — I've updated the financials slide based on our conversation yesterday...",
    body: `Hi David,\n\nI've updated the financials slide based on our conversation yesterday. The projection now accounts for a more conservative growth rate in Q1, with ramp-up in Q2.\n\nLet me know if this version works for you or if we should tweak the assumptions further.\n\nBest,\nAlex`,
    receivedAt: hours(12),
    unread: false,
    starred: true,
    labels: ["work", "finance"],
    aiPriority: 72,
    folder: "sent",
  },
  {
    senderName: "Marketing Team",
    senderEmail: "marketing@corsior.com",
    subject: "[Draft] Launch announcement press release",
    preview:
      "FOR IMMEDIATE RELEASE — Corsior announces its next-generation AI-powered email client...",
    body: `FOR IMMEDIATE RELEASE\n\nCorsior announces its next-generation AI-powered email client designed for high-agency teams. Built with Next.js, Tailwind CSS, and advanced semantic AI agents.\n\nKey features include lightning-fast navigation, inline AI assistance, and automatic virtualization supporting 100k+ emails.`,
    receivedAt: hours(18),
    unread: false,
    starred: false,
    labels: ["work", "product"],
    aiPriority: 50,
    folder: "drafts",
  },
  {
    senderName: "Landlord Harrison",
    senderEmail: "harrison@properties.com",
    subject: "[Draft] Lease renewal inquiry",
    preview:
      "Hi Mr. Harrison — I was writing to check if you have sent over the lease agreement for next year...",
    body: `Hi Mr. Harrison,\n\nI hope you're doing well. I was writing to check if you have sent over the lease agreement for next year yet? I'd like to sign and return it this week if possible.\n\nThanks,\nAlex`,
    receivedAt: hours(36),
    unread: false,
    starred: false,
    labels: ["personal"],
    aiPriority: 30,
    folder: "drafts",
  },
  {
    senderName: "Netflix",
    senderEmail: "info@account.netflix.com",
    subject: "New arrivals: See what's next in December",
    preview:
      "Hey Alex — Here's what we have lined up for you this month on Netflix. Catch the new season...",
    body: `Hey Alex,\n\nHere's what we have lined up for you this month on Netflix. From highly anticipated series returns to award-winning documentaries, here is your curated list.\n\nEnjoy,\nThe Netflix Team`,
    receivedAt: hours(42),
    unread: false,
    starred: false,
    labels: ["personal"],
    aiPriority: 15,
    folder: "archive",
  },
  {
    senderName: "Airbnb Support",
    senderEmail: "noreply@airbnb.com",
    subject: "Your reservation in Kyoto is confirmed!",
    preview:
      "Hi Alex — You're all set for Kyoto! Here is your itinerary and host details for your Ryokan stay...",
    body: `Hi Alex,\n\nYou're all set for Kyoto! Your reservation at the Gion Ryokan has been confirmed by your host, Hiroshi. \n\nCheck-in details and arrival instructions are available in the app.\n\nWarm regards,\nAirbnb Team`,
    receivedAt: hours(48),
    unread: false,
    starred: true,
    labels: ["personal", "travel"],
    aiPriority: 82,
    folder: "archive",
  },
  {
    senderName: "CryptoMoon",
    senderEmail: "gainz@cryptomoon-rewards.xyz",
    subject: "!!! Get 10000x returns overnight with MoonCoin !!!",
    preview: "DEAR FRIEND — DO NOT MISS THIS EXTREMELY LIMITED OPPORTUNITY TO BUY MOONCOIN...",
    body: `DEAR FRIEND,\n\nDO NOT MISS THIS EXTREMELY LIMITED OPPORTUNITY TO BUY MOONCOIN BEFORE THE HUGE ROCKET PUMP! WE ARE LAUNCHING IN 2 HOURS.\n\nCLICK HERE TO GET FREE TOKENS IMMEDIATELY!`,
    receivedAt: hours(72),
    unread: true,
    starred: false,
    labels: ["personal"],
    aiPriority: 2,
    folder: "spam",
  },
  {
    senderName: "Low Price Meds",
    senderEmail: "rx-deals@meds-fast-direct.com",
    subject: "Cheapest options for prescriptions without premium",
    preview: "Hello — We offer top quality options at unbeatable prices. Fast shipping globally...",
    body: `Hello,\n\nWe offer top quality prescriptions and healthcare products at unbeatable prices. No doctor visit or premium cost required. Fast shipping globally, discreet packaging.\n\nVisit our shop today.`,
    receivedAt: hours(96),
    unread: true,
    starred: false,
    labels: ["personal"],
    aiPriority: 1,
    folder: "spam",
  },
  {
    senderName: "Zoom Video",
    senderEmail: "no-reply@zoom.us",
    subject: "Canceled: Sync Meeting with Marcus",
    preview: "The meeting scheduled for Nov 12, 2026 has been canceled by Marcus Liu...",
    body: `The meeting scheduled for Nov 12, 2026 at 10:00 AM PST has been canceled by Marcus Liu. No action is required.\n\nIf you believe this was in error, please coordinate with the host directly.`,
    receivedAt: hours(120),
    unread: false,
    starred: false,
    labels: ["work"],
    aiPriority: 10,
    folder: "trash",
  },
  {
    senderName: "Hacker News Digest",
    senderEmail: "digest@hn-mail.org",
    subject: "Hacker News Weekly top posts",
    preview:
      "Here are the top posts from Hacker News this week: 1. Show HN: Corsior... 2. Why I still use vanilla CSS...",
    body: `Here are the top posts from Hacker News this week:\n\n1. **Show HN: Corsior** — Next-gen AI email client with virtualization. (421 points, 102 comments)\n2. **Why I still use vanilla CSS** — An opinionated take on modern layout systems. (312 points, 89 comments)\n3. **My experience running a Next.js app on bare metal** (215 points, 45 comments)`,
    receivedAt: hours(144),
    unread: false,
    starred: false,
    labels: ["newsletter"],
    aiPriority: 18,
    folder: "trash",
  },
  {
    senderName: "Landlord Harrison",
    senderEmail: "harrison@properties.com",
    subject: "[Draft] Lease renewal inquiry",
    preview:
      "Hi Mr. Harrison — I was writing to check if you have sent over the lease agreement for next year...",
    body: `Hi Mr. Harrison,\n\nI hope you're doing well. I was writing to check if you have sent over the lease agreement for next year yet? I'd like to sign and return it this week if possible.\n\nThanks,\nAlex`,
    receivedAt: hours(36),
    unread: false,
    starred: false,
    labels: ["personal"],
    aiPriority: 30,
    folder: "drafts",
  },
  {
    senderName: "Netflix",
    senderEmail: "info@account.netflix.com",
    subject: "New arrivals: See what's next in December",
    preview:
      "Hey Alex — Here's what we have lined up for you this month on Netflix. Catch the new season...",
    body: `Hey Alex,\n\nHere's what we have lined up for you this month on Netflix. From highly anticipated series returns to award-winning documentaries, here is your curated list.\n\nEnjoy,\nThe Netflix Team`,
    receivedAt: hours(42),
    unread: false,
    starred: false,
    labels: ["personal"],
    aiPriority: 15,
    folder: "archive",
  },
  {
    senderName: "Airbnb Support",
    senderEmail: "noreply@airbnb.com",
    subject: "Your reservation in Kyoto is confirmed!",
    preview:
      "Hi Alex — You're all set for Kyoto! Here is your itinerary and host details for your Ryokan stay...",
    body: `Hi Alex,\n\nYou're all set for Kyoto! Your reservation at the Gion Ryokan has been confirmed by your host, Hiroshi. \n\nCheck-in details and arrival instructions are available in the app.\n\nWarm regards,\nAirbnb Team`,
    receivedAt: hours(48),
    unread: false,
    starred: true,
    labels: ["personal", "travel"],
    aiPriority: 82,
    folder: "archive",
  },
  {
    senderName: "Landlord Harrison",
    senderEmail: "harrison@properties.com",
    subject: "[Draft] Lease renewal inquiry",
    preview:
      "Hi Mr. Harrison — I was writing to check if you have sent over the lease agreement for next year...",
    body: `Hi Mr. Harrison,\n\nI hope you're doing well. I was writing to check if you have sent over the lease agreement for next year yet? I'd like to sign and return it this week if possible.\n\nThanks,\nAlex`,
    receivedAt: hours(36),
    unread: false,
    starred: false,
    labels: ["personal"],
    aiPriority: 30,
    folder: "drafts",
  },
  {
    senderName: "Netflix",
    senderEmail: "info@account.netflix.com",
    subject: "New arrivals: See what's next in December",
    preview:
      "Hey Alex — Here's what we have lined up for you this month on Netflix. Catch the new season...",
    body: `Hey Alex,\n\nHere's what we have lined up for you this month on Netflix. From highly anticipated series returns to award-winning documentaries, here is your curated list.\n\nEnjoy,\nThe Netflix Team`,
    receivedAt: hours(42),
    unread: false,
    starred: false,
    labels: ["personal"],
    aiPriority: 15,
    folder: "archive",
  },
  {
    senderName: "Airbnb Support",
    senderEmail: "noreply@airbnb.com",
    subject: "Your reservation in Kyoto is confirmed!",
    preview:
      "Hi Alex — You're all set for Kyoto! Here is your itinerary and host details for your Ryokan stay...",
    body: `Hi Alex,\n\nYou're all set for Kyoto! Your reservation at the Gion Ryokan has been confirmed by your host, Hiroshi. \n\nCheck-in details and arrival instructions are available in the app.\n\nWarm regards,\nAirbnb Team`,
    receivedAt: hours(48),
    unread: false,
    starred: true,
    labels: ["personal", "travel"],
    aiPriority: 82,
    folder: "archive",
  },

  {
    senderName: "Landlord Harrison",
    senderEmail: "harrison@properties.com",
    subject: "[Draft] Lease renewal inquiry",
    preview:
      "Hi Mr. Harrison — I was writing to check if you have sent over the lease agreement for next year...",
    body: `Hi Mr. Harrison,\n\nI hope you're doing well. I was writing to check if you have sent over the lease agreement for next year yet? I'd like to sign and return it this week if possible.\n\nThanks,\nAlex`,
    receivedAt: hours(36),
    unread: false,
    starred: false,
    labels: ["personal"],
    aiPriority: 30,
    folder: "drafts",
  },
  {
    senderName: "Netflix",
    senderEmail: "info@account.netflix.com",
    subject: "New arrivals: See what's next in December",
    preview:
      "Hey Alex — Here's what we have lined up for you this month on Netflix. Catch the new season...",
    body: `Hey Alex,\n\nHere's what we have lined up for you this month on Netflix. From highly anticipated series returns to award-winning documentaries, here is your curated list.\n\nEnjoy,\nThe Netflix Team`,
    receivedAt: hours(42),
    unread: false,
    starred: false,
    labels: ["personal"],
    aiPriority: 15,
    folder: "archive",
  },
  {
    senderName: "Airbnb Support",
    senderEmail: "noreply@airbnb.com",
    subject: "Your reservation in Kyoto is confirmed!",
    preview:
      "Hi Alex — You're all set for Kyoto! Here is your itinerary and host details for your Ryokan stay...",
    body: `Hi Alex,\n\nYou're all set for Kyoto! Your reservation at the Gion Ryokan has been confirmed by your host, Hiroshi. \n\nCheck-in details and arrival instructions are available in the app.\n\nWarm regards,\nAirbnb Team`,
    receivedAt: hours(48),
    unread: false,
    starred: true,
    labels: ["personal", "travel"],
    aiPriority: 82,
    folder: "archive",
  },
];

export const emails: Email[] = seeds.map((s, i) => ({
  ...s,
  id: `email-${i + 1}`,
  initials: initialsOf(s.senderName),
  avatarColor: palette[i % palette.length],
}));

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
