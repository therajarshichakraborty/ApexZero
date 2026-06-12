import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Sparkles, ArrowUp, X, Wand2, ListChecks, CalendarClock, FileSearch } from "lucide-react";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

type Msg = { id: string; role: "user" | "assistant"; content: string; streaming?: boolean };

const quickActions = [
  { icon: Sparkles, label: "Summarize thread" },
  { icon: ListChecks, label: "Extract action items" },
  { icon: Wand2, label: "Draft a reply" },
  { icon: CalendarClock, label: "Find meeting times" },
  { icon: FileSearch, label: "Search attachments" },
];

const seed: Msg[] = [
  {
    id: "m1",
    role: "assistant",
    content:
      "Good morning. You have **3 priority threads** today — Elena's Q4 roadmap needs a reply by Friday, Amelia (a16z) is asking for a call, and Marcus's virtualizer is ready to ship.",
  },
];

export function AiAssistant() {
  const { assistantOpen, toggleAssistant } = useApp();
  const [msgs, setMsgs] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: trimmed };
    const aiId = crypto.randomUUID();
    setMsgs((m) => [...m, userMsg, { id: aiId, role: "assistant", content: "", streaming: true }]);
    setInput("");

    const reply = mockReply(trimmed);
    let i = 0;
    const tick = () => {
      i += Math.max(1, Math.floor(reply.length / 80));
      setMsgs((curr) =>
        curr.map((m) =>
          m.id === aiId ? { ...m, content: reply.slice(0, i), streaming: i < reply.length } : m,
        ),
      );
      if (i < reply.length) setTimeout(tick, 28);
    };
    setTimeout(tick, 240);
  };

  return (
    <AnimatePresence initial={false}>
      {assistantOpen && (
        <motion.aside
          key="assistant"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 320, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex h-full shrink-0 overflow-hidden border-l border-border"
        >
          <div className="flex h-full w-[320px] flex-col">
          <header className="flex h-11 items-center gap-2 border-b border-border px-3">
              <div className="grid h-6 w-6 place-items-center rounded-md bg-muted text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[12.5px] font-semibold">Assistant</span>
                <span className="text-[10px] text-muted-foreground">
                  ApexZero AI · 1.0
                </span>
              </div>
              <button
                onClick={toggleAssistant}
                aria-label="Close assistant"
                className="ml-auto grid h-7 w-7 place-items-center rounded-md text-muted-foreground/60 hover:bg-muted hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </header>

            <div ref={scrollRef} className="scrollbar-elegant flex-1 overflow-y-auto px-4 py-5">
              <div className="flex flex-col gap-4">
                {msgs.map((m) => (
                  <Bubble key={m.id} msg={m} />
                ))}
              </div>
            </div>

            <div className="border-t border-border px-4 pt-3 pb-4">
              <div className="mb-2 flex flex-wrap gap-1">
                {quickActions.slice(0, 3).map((a) => (
                  <button
                    key={a.label}
                    onClick={() => send(a.label)}
                    className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <a.icon className="h-3 w-3" />
                    {a.label}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex items-end gap-2 rounded-lg border border-border p-2 pl-3 transition-colors focus-within:border-foreground/20"
              >
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  rows={1}
                  placeholder="Ask anything about your inbox…"
                  className="scrollbar-elegant max-h-32 min-h-[28px] flex-1 resize-none bg-transparent py-1 text-[12.5px] leading-relaxed placeholder:text-muted-foreground/40 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  aria-label="Send"
                  className={cn(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-md transition-all",
                    input.trim()
                      ? "bg-foreground text-background hover:opacity-80"
                      : "text-muted-foreground/40",
                  )}
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function Bubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={cn("flex", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[88%] rounded-xl px-3.5 py-2.5 text-[12.5px] leading-relaxed",
          isUser
            ? "bg-foreground text-background"
            : "border border-border bg-muted/30 text-foreground",
        )}
      >
        <Rendered text={msg.content} />
        {msg.streaming && (
          <span className="ml-0.5 inline-block h-3 w-[2px] translate-y-0.5 animate-pulse rounded-sm bg-current align-middle" />
        )}
      </div>
    </motion.div>
  );
}

function Rendered({ text }: { text: string }) {
  if (!text) return <TypingDots />;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span className="whitespace-pre-wrap">
      {parts.map((p, i) =>
        p.startsWith("**") ? (
          <strong key={i} className="font-semibold">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </span>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
          className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70"
        />
      ))}
    </span>
  );
}

function mockReply(q: string): string {
  const lower = q.toLowerCase();
  if (lower.includes("summarize"))
    return "Here's the gist of the current thread: Elena is finalizing Q4 priorities and wants your sign-off by Friday so engineering can kick off Monday. The three threads are **billing migration** (6 weeks), **identity unification** (unblocks SSO), and **internal tooling** (one engineer-month).";
  if (lower.includes("action"))
    return "Action items I found:\n\n1. Reply to Elena with Q4 priority ranking — due Friday.\n2. Schedule 30 min with Amelia (a16z) Wed or Thu.\n3. Review Marcus's virtualizer PR before Tuesday ship.";
  if (lower.includes("draft") || lower.includes("reply"))
    return "Draft:\n\nHi Elena — thanks for putting this together. My ranking would be **identity → billing → tooling**: SSO unblocks the enterprise pipeline, billing is high-leverage but contained, and tooling can wait one more cycle. Happy to jump on a 15-min call to align.";
  if (lower.includes("meeting"))
    return "You're free Wed 2–4pm and Thu 10–11am PT. Want me to send Amelia three options?";
  return "Got it. Pulling context from your inbox now — give me a second to look across the relevant threads.";
}
