"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Zap,
  Brain,
  Command,
  PenSquare,
  Inbox,
  Sparkles,
  Star,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Shield,
  BarChart2,
  Layers,
  RefreshCw,
  Users,
} from "lucide-react";

const TECH_PILLS = [
  "Next.js 16",
  "Tailwind v4",
  "Zustand",
  "Radix UI",
  "GPT-4o",
  "Turbopack",
  "TypeScript",
  "Motion",
];

const STATS = [
  { value: "10×", label: "Faster inbox triage" },
  { value: "3s", label: "Avg. AI reply time" },
  { value: "99%", label: "Priority accuracy" },
  { value: "0", label: "Setup required" },
];

const FEATURES = [
  {
    icon: Brain,
    title: "AI Priority Scoring",
    desc: "Every email scored across 12 signals. High-impact threads surface instantly.",
  },
  {
    icon: Command,
    title: "Command Palette",
    desc: "One keystroke. Every action. Navigate, compose, search — no mouse needed.",
  },
  {
    icon: PenSquare,
    title: "Smart Compose",
    desc: "Describe your intent. ApexZero drafts in your voice, ready to send in seconds.",
  },
  {
    icon: Clock,
    title: "Send Later",
    desc: "Schedule at the perfect time for any timezone. Never send at 3 AM again.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    desc: "Your data never trains models. On-device processing. Zero-knowledge sync.",
  },
  {
    icon: BarChart2,
    title: "Inbox Analytics",
    desc: "See response times, peak hours, and top senders — data-driven clarity.",
  },
  {
    icon: Layers,
    title: "AI Summaries",
    desc: "Threads collapsed into a crisp paragraph. Read 50 emails in 5 minutes.",
  },
  {
    icon: RefreshCw,
    title: "Auto Follow-Up",
    desc: "ApexZero notices when someone hasn't replied and drafts a polite nudge.",
  },
  {
    icon: Users,
    title: "Team Inbox",
    desc: "Shared inboxes, assignments, internal notes — without leaving your client.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Open ApexZero",
    desc: "No sign-up, no OAuth dance. Open the app — your inbox is ready instantly.",
  },
  {
    n: "02",
    title: "AI learns your style",
    desc: "Spend a few minutes triaging. ApexZero watches and begins scoring in real time.",
  },
  {
    n: "03",
    title: "Reach Inbox Zero",
    desc: "Archive, reply, delegate — one click. The AI handles the repetitive parts.",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "CTO, Luminary AI",
    avatar: "SC",
    rating: 5,
    quote:
      "I went from 2 hours in email per day to 20 minutes. The AI priority scoring is scarily accurate — it knew what mattered before I did.",
  },
  {
    name: "James Okafor",
    role: "Founder, Meridian Labs",
    avatar: "JO",
    rating: 5,
    quote:
      "The command palette alone is worth it. I haven't touched my mouse to navigate email in three weeks.",
  },
  {
    name: "Priya Sharma",
    role: "Head of Product, Nexus",
    avatar: "PS",
    rating: 5,
    quote:
      "Smart Compose writes better replies than I do. My team thinks I've become a better communicator. I haven't told them my secret.",
  },
  {
    name: "Marcus Webb",
    role: "Engineering Lead, Stratos",
    avatar: "MW",
    rating: 5,
    quote:
      "AI summaries on long threads save me 45 minutes every single day. Absolutely indispensable.",
  },
  {
    name: "Aiko Tanaka",
    role: "Design Director, Forma",
    avatar: "AT",
    rating: 5,
    quote:
      "It's beautiful. Every detail is intentional. The dark mode is the best I've seen in any productivity app — period.",
  },
  {
    name: "Leo Fernández",
    role: "CEO, Vortex Systems",
    avatar: "LF",
    rating: 5,
    quote:
      "We rolled this out to our 12-person team and response time dropped 60%. No-reply rate practically zero.",
  },
];

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Everything you need to experience the future of email.",
    cta: "Start for free",
    ctaHref: "/mail",
    highlight: false,
    features: [
      "Unlimited emails",
      "AI priority scoring",
      "Command palette",
      "Smart Compose (10/day)",
      "Dark & light mode",
    ],
  },
  {
    name: "Pro",
    price: "$12",
    period: "per month",
    desc: "For power users who live in their inbox.",
    cta: "Get Pro",
    ctaHref: "/mail",
    highlight: true,
    features: [
      "Everything in Free",
      "Unlimited Smart Compose",
      "Auto follow-up reminders",
      "AI summaries on all threads",
      "Send Later scheduling",
      "Inbox analytics dashboard",
    ],
  },
  {
    name: "Team",
    price: "$29",
    period: "per seat / month",
    desc: "Collaborative inbox management for fast-moving teams.",
    cta: "Contact us",
    ctaHref: "#",
    highlight: false,
    features: [
      "Everything in Pro",
      "Shared team inboxes",
      "Assignment & delegation",
      "Internal thread notes",
      "SSO & audit logs",
      "Custom AI personas",
    ],
  },
];

const FAQS = [
  {
    q: "Do I need to sign up or connect my real email?",
    a: "No. ApexZero ships with rich demo data so you can explore the full experience immediately — no account, no OAuth, no email address required.",
  },
  {
    q: "How does AI priority scoring work?",
    a: "Each email is analyzed across 12 signals: sender relationship, keyword urgency, thread age, your interaction history, and more. Scores update in real time.",
  },
  {
    q: "Is my email data used to train AI models?",
    a: "Never. Your data stays on-device and in your account only. We use purpose-built inference APIs with strict zero-retention policies.",
  },
  {
    q: "Which email providers does ApexZero support?",
    a: "Gmail, Google Workspace, Outlook/Office 365, iCloud Mail, and any IMAP provider. SMTP send support is included for all.",
  },
  {
    q: "Can I use ApexZero on mobile?",
    a: "The web app is fully responsive and optimized for mobile browsers. Native iOS and Android apps are on the roadmap for Q3 2025.",
  },
  {
    q: "What happens if I exceed my Smart Compose limit?",
    a: "On the Free plan you get 10 AI-assisted drafts per day, reset at midnight UTC. Upgrade to Pro for unlimited drafts.",
  },
];

const COMPANIES = ["Stripe", "Vercel", "Linear", "Notion", "Figma", "Loom", "Railway", "Resend"];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Stars({ n = 5 }: { n?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} className="h-3 w-3 fill-current text-foreground" />
      ))}
    </div>
  );
}

function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
      {FAQS.map((f, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-150 hover:bg-muted/40"
          >
            <span className="text-[14px] font-medium text-foreground">{f.q}</span>
            <span
              className={`shrink-0 transition-transform duration-300 ${open === i ? "rotate-180" : ""}`}
            >
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${open === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
          >
            <p className="px-6 pb-5 text-[13.5px] leading-relaxed text-muted-foreground">{f.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function InboxMockup() {
  const [active, setActive] = useState(0);
  const emails = [
    {
      from: "Elena Vasquez",
      subj: "Q4 roadmap priorities",
      preview: "I wanted to loop you in before Monday's kickoff…",
      time: "9:41am",
      score: 94,
      unread: true,
    },
    {
      from: "Amelia Park",
      subj: "Intro call — a16z",
      preview: "James suggested I reach out. Would love to find…",
      time: "8:20am",
      score: 88,
      unread: true,
    },
    {
      from: "Marcus Webb",
      subj: "Virtualizer PR ready",
      preview: "Benchmarks landed at 3.2ms for 10k messages…",
      time: "7:55am",
      score: 72,
      unread: false,
    },
    {
      from: "GitHub",
      subj: "[apex-zero] CI passed",
      preview: "All checks passed on #284 · merge ready",
      time: "7:12am",
      score: 31,
      unread: false,
    },
    {
      from: "Stripe",
      subj: "Your invoice #4821",
      preview: "$249.00 due Dec 1. View invoice →",
      time: "Yesterday",
      score: 28,
      unread: false,
    },
  ];
  return (
    <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-background shadow-2xl shadow-black/10 transition-shadow duration-300 hover:shadow-black/20">
      <div className="flex h-9 items-center gap-2 border-b border-border bg-muted/40 px-4">
        <div className="h-2.5 w-2.5 rounded-full bg-destructive/50" />
        <div className="h-2.5 w-2.5 rounded-full bg-border" />
        <div className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="mx-auto text-[11px] text-muted-foreground">ApexZero — Inbox</span>
      </div>
      <div className="flex">
        <div className="hidden w-[155px] shrink-0 flex-col gap-1 border-r border-border p-3 sm:flex">
          {["Inbox", "Important", "Starred", "Sent", "Drafts", "Archive"].map((l, i) => (
            <div
              key={l}
              className={`flex h-7 cursor-pointer items-center gap-2 rounded-lg px-2 text-[11px] transition-colors hover:bg-muted ${i === 0 ? "bg-muted font-medium text-foreground" : "text-muted-foreground"}`}
            >
              <div className="h-2 w-2 rounded-sm bg-border" />
              {l}
              {i === 0 && <span className="ml-auto text-[10px]">5</span>}
            </div>
          ))}
        </div>
        <div className="flex-1 divide-y divide-border">
          {emails.map((e, i) => (
            <div
              key={i}
              onClick={() => setActive(i)}
              className={`flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors duration-150 ${i === active ? "bg-muted/50" : "hover:bg-muted/25"}`}
            >
              <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-muted text-[10px] font-semibold">
                {e.from
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`truncate text-[12px] ${e.unread ? "font-semibold text-foreground" : "text-foreground/65"}`}
                  >
                    {e.from}
                  </span>
                  {e.unread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />}
                  <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">
                    {e.time}
                  </span>
                </div>
                <p
                  className={`truncate text-[11.5px] ${e.unread ? "text-foreground/90" : "text-muted-foreground"}`}
                >
                  {e.subj}
                </p>
                <p className="truncate text-[10.5px] text-muted-foreground/60">{e.preview}</p>
              </div>
              <div
                className={`mt-1 shrink-0 rounded-md border px-1.5 py-0.5 text-[9.5px] font-medium tabular-nums ${e.score >= 80 ? "border-foreground/20 bg-foreground/8 text-foreground" : "border-border text-muted-foreground"}`}
              >
                {e.score}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-14 text-center">
          <div className="mb-6 inline-flex cursor-default items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1 text-[11.5px] font-medium text-muted-foreground transition-all duration-200 hover:border-foreground/20 hover:bg-muted">
            <Sparkles className="h-3 w-3" />
            AI-Native · Zero Setup · Beautifully Minimal
          </div>
          <h1 className="text-balance text-[clamp(2.5rem,7vw,4.75rem)] font-bold leading-[1.06] tracking-[-0.03em]">
            Move through email
            <br />
            <span className="text-muted-foreground">at the speed of thought.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-[15.5px] leading-relaxed text-muted-foreground">
            ApexZero is an AI-native email client that triages your inbox, drafts your replies, and
            surfaces what matters — before you even ask.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/mail"
              className="relative p-[1.5px] overflow-hidden rounded-full flex items-center justify-center transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer group shadow-[0_10px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_30px_rgba(255,255,255,0.05)]"
            >
              {/* Spinning gradient border */}
              <span className="absolute inset-[-1000%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#e2e8f0_0%,#cbd5e1_25%,#6366f1_50%,#cbd5e1_75%,#e2e8f0_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#3b82f6_0%,#8b5cf6_25%,#f43f5e_50%,#8b5cf6_75%,#3b82f6_100%)] opacity-40 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 flex h-11 items-center gap-2 rounded-full bg-neutral-950 dark:bg-white px-8 text-[13.5px] font-semibold tracking-wide text-white dark:text-neutral-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                {/* Shimmer glare sweep */}
                <div className="absolute inset-0 w-[50%] h-full bg-gradient-to-r from-transparent via-white/20 dark:via-neutral-950/10 to-transparent -skew-x-12 -translate-x-[150%] group-hover:translate-x-[250%] transition-transform duration-1000 ease-out pointer-events-none" />

                <Zap className="h-3.5 w-3.5 fill-current transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                <span>Start for free</span>
              </div>
            </Link>
            <a
              href="#features"
              className="relative overflow-hidden group flex h-11.5 items-center gap-2 rounded-full border border-border/80 bg-background/30 backdrop-blur-sm px-8 text-[13.5px] font-medium text-foreground/80 hover:text-foreground shadow-sm hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:bg-muted/40 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-2">
                See features{" "}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {TECH_PILLS.map((t, i) => (
              <span
                key={t}
                className="cursor-default rounded-full border border-border px-3 py-0.5 text-[11px] text-muted-foreground transition-all duration-200 hover:border-foreground/30 hover:text-foreground hover:bg-muted"
                style={{ transitionDelay: `${i * 30}ms` }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-6 pb-20">
          <InboxMockup />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-background to-transparent" />
        </div>
      </section>

      <section className="border-y border-border bg-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {COMPANIES.map((c) => (
              <span
                key={c}
                className="cursor-default text-[13px] font-semibold text-muted-foreground/40 transition-all duration-200 hover:text-muted-foreground/70"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-border sm:grid-cols-4 sm:divide-y-0">
          {STATS.map((s, i) => (
            <FadeIn key={s.label} delay={i * 80}>
              <div className="group flex flex-col items-center gap-1.5 py-12 transition-colors duration-200 hover:bg-muted/20">
                <span className="text-[2.8rem] font-bold leading-none tracking-tight transition-transform duration-200 group-hover:scale-110">
                  {s.value}
                </span>
                <span className="text-[12.5px] text-muted-foreground">{s.label}</span>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 py-24">
        <FadeIn>
          <div className="mb-14 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Features
            </p>
            <h2 className="mt-3 text-[2.25rem] font-bold tracking-tight">
              Built different. By design.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-muted-foreground">
              Every feature exists to reduce friction. Nothing is added without removing something
              harder.
            </p>
          </div>
        </FadeIn>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <FadeIn key={f.title} delay={i * 60}>
                <div className="group h-full cursor-default rounded-2xl border border-border bg-muted/20 p-6 transition-all duration-200 hover:bg-muted/40 hover:border-foreground/20 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5">
                  <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl border border-border bg-background text-foreground transition-transform duration-200 group-hover:scale-110">
                    <Icon className="h-[18px] w-[18px]" />
                  </div>
                  <p className="mb-2 text-[14.5px] font-semibold tracking-tight">{f.title}</p>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">{f.desc}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </section>

      <section id="how-it-works" className="border-y border-border bg-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <FadeIn>
            <div className="mb-14 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                How it works
              </p>
              <h2 className="mt-3 text-[2.25rem] font-bold tracking-tight">
                From open to Inbox Zero in minutes.
              </h2>
            </div>
          </FadeIn>
          <div className="grid gap-8 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <FadeIn key={s.n} delay={i * 120}>
                <div className="group cursor-default">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-[13px] font-bold transition-all duration-200 group-hover:bg-foreground group-hover:text-background group-hover:border-foreground group-hover:scale-110">
                    {s.n}
                  </div>
                  <p className="mb-2 text-[15px] font-semibold tracking-tight">{s.title}</p>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <FadeIn>
          <div className="mb-14 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Testimonials
            </p>
            <h2 className="mt-3 text-[2.25rem] font-bold tracking-tight">
              People actually love their inbox now.
            </h2>
          </div>
        </FadeIn>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={t.name} delay={i * 70}>
              <div className="group flex h-full cursor-default flex-col gap-4 rounded-2xl border border-border bg-muted/20 p-6 transition-all duration-200 hover:bg-muted/40 hover:border-foreground/20 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5">
                <Stars n={t.rating} />
                <p className="flex-1 text-[13.5px] leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3 border-t border-border pt-4">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-foreground text-[10px] font-bold text-background transition-transform duration-200 group-hover:scale-110">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold leading-tight">{t.name}</p>
                    <p className="text-[11.5px] leading-tight text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section id="pricing" className="border-y border-border bg-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <FadeIn>
            <div className="mb-14 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Pricing
              </p>
              <h2 className="mt-3 text-[2.25rem] font-bold tracking-tight">
                Simple. Transparent. Fair.
              </h2>
              <p className="mx-auto mt-3 max-w-sm text-[14px] leading-relaxed text-muted-foreground">
                Start free. Upgrade when you need more. Cancel any time.
              </p>
            </div>
          </FadeIn>
          <div className="grid gap-4 sm:grid-cols-3">
            {PLANS.map((p, i) => (
              <FadeIn key={p.name} delay={i * 100}>
                <div
                  className={`group relative flex h-full flex-col rounded-2xl border p-7 transition-all duration-200 hover:-translate-y-1 ${
                    p.highlight
                      ? "border-foreground bg-foreground text-background shadow-2xl shadow-foreground/20"
                      : "border-border bg-background hover:border-foreground/20 hover:shadow-lg hover:shadow-black/5"
                  }`}
                >
                  {p.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-background bg-background px-3 py-0.5 text-[10.5px] font-semibold text-foreground shadow">
                      Most popular
                    </div>
                  )}
                  <p
                    className={`text-[11px] font-semibold uppercase tracking-widest ${p.highlight ? "text-background/60" : "text-muted-foreground"}`}
                  >
                    {p.name}
                  </p>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-[2.5rem] font-bold tracking-tight">{p.price}</span>
                    <span
                      className={`text-[12.5px] ${p.highlight ? "text-background/60" : "text-muted-foreground"}`}
                    >
                      /{p.period}
                    </span>
                  </div>
                  <p
                    className={`mt-2 text-[13px] ${p.highlight ? "text-background/70" : "text-muted-foreground"}`}
                  >
                    {p.desc}
                  </p>
                  <ul className="mt-6 flex flex-col gap-2.5">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-[13px]">
                        <Check
                          className={`h-3.5 w-3.5 shrink-0 ${p.highlight ? "text-background/80" : ""}`}
                        />
                        <span className={p.highlight ? "text-background/90" : ""}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={p.ctaHref}
                    className={`relative overflow-hidden group mt-8 flex h-10 items-center justify-center rounded-full text-[13px] font-bold tracking-wide transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer ${
                      p.highlight
                        ? "bg-background text-foreground border border-foreground/10 hover:bg-background/90 shadow-[0_4px_12px_rgba(255,255,255,0.1),inset_0_1px_0_rgba(255,255,255,0.2)]"
                        : "bg-foreground text-background border border-neutral-800 dark:border-neutral-200/50 hover:bg-foreground/90 shadow-[0_4px_12px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_12px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.4)]"
                    }`}
                  >
                    {/* Glint sweep */}
                    <div
                      className={`absolute inset-0 w-[50%] h-full bg-gradient-to-r from-transparent ${p.highlight ? "via-black/5 dark:via-white/10" : "via-white/20 dark:via-neutral-950/10"} to-transparent -skew-x-12 -translate-x-[150%] group-hover:translate-x-[250%] transition-transform duration-1000 ease-out pointer-events-none`}
                    />
                    <span className="relative z-10 flex items-center gap-1.5">
                      {p.cta}{" "}
                      <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
        <FadeIn>
          <div className="mb-12 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              FAQ
            </p>
            <h2 className="mt-3 text-[2.25rem] font-bold tracking-tight">Frequently asked</h2>
          </div>
        </FadeIn>
        <FadeIn delay={100}>
          <FAQAccordion />
        </FadeIn>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <FadeIn>
            <div className="group cursor-default rounded-3xl border border-border bg-foreground px-8 py-16 text-center text-background transition-all duration-300 hover:shadow-2xl hover:shadow-foreground/15">
              <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl border border-background/20 bg-background/10 transition-transform duration-200 group-hover:scale-110">
                <Inbox className="h-5 w-5" />
              </div>
              <h2 className="text-[2rem] font-bold tracking-tight">Ready to reach Inbox Zero?</h2>
              <p className="mx-auto mt-3 max-w-sm text-[14px] leading-relaxed text-background/70">
                No sign-up. No credit card. No friction. Just open the app and experience what email
                should feel like.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
                <Link
                  href="/mail"
                  className="relative overflow-hidden group flex h-11.5 items-center gap-2 rounded-full bg-background px-8 text-[13.5px] font-semibold tracking-wide text-foreground border border-foreground/10 shadow-[0_10px_30px_rgba(0,0,0,0.1),inset_0_1.5px_0_rgba(255,255,255,0.2)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 cursor-pointer"
                >
                  {/* Shimmer glare sweep */}
                  <div className="absolute inset-0 w-[50%] h-full bg-gradient-to-r from-transparent via-neutral-950/5 dark:via-white/10 to-transparent -skew-x-12 -translate-x-[150%] group-hover:translate-x-[250%] transition-transform duration-1000 ease-out pointer-events-none" />

                  <PenSquare className="relative z-10 h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110" />
                  <span className="relative z-10">Open ApexZero</span>
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-10 sm:grid-cols-4">
            <div className="sm:col-span-1">
              <Link
                href="/"
                className="flex items-center gap-2 font-semibold transition-opacity hover:opacity-70"
              >
                <span className="grid h-6 w-6 place-items-center rounded-md bg-foreground text-background text-[10px] font-bold">
                  AZ
                </span>
                <span className="text-[14px]">ApexZero</span>
              </Link>
              <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">
                The AI-native email client. Move faster. Think less. Do more.
              </p>
            </div>
            {[
              { heading: "Product", links: ["Features", "Pricing", "Changelog", "Roadmap"] },
              { heading: "Company", links: ["About", "Blog", "Careers", "Press"] },
              { heading: "Legal", links: ["Privacy", "Terms", "Security", "Cookies"] },
            ].map((col) => (
              <div key={col.heading}>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {col.heading}
                </p>
                <ul className="flex flex-col gap-2">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="group relative text-[13px] text-muted-foreground transition-colors duration-150 hover:text-foreground"
                      >
                        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-foreground transition-all duration-200 group-hover:w-full" />
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
            <span className="text-[12px] text-muted-foreground">
              © 2025 ApexZero · Built with Next.js 16, Tailwind v4 &amp; ❤️ by Rajarshi Chakraborty
            </span>
            <div className="flex items-center gap-4">
              {["Twitter", "GitHub", "Discord"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-[12px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
