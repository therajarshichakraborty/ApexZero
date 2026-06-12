import { AnimatePresence, motion } from "motion/react";
import {
  Reply, ReplyAll, Forward, Archive, Trash2, Star,
  Sparkles, Languages, Wand2, MoreHorizontal, Paperclip,
  Inbox, PanelRight,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { type Email } from "@/lib/mock-data";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

function ReceivedAt({ date }: { date: Date }) {
  const mounted = useMounted();
  if (!mounted) return <span className="opacity-0">—</span>;
  return (
    <span suppressHydrationWarning>
      {date.toLocaleString([], {
        weekday: "short", month: "short", day: "numeric",
        hour: "numeric", minute: "2-digit",
      })}
    </span>
  );
}

export function EmailReader() {
  const { emails, selectedId, archive, remove, toggleStar, toggleAssistant } = useApp();
  const email = emails.find((e) => e.id === selectedId) ?? null;

  return (
    <div className="relative flex h-full min-w-0 flex-1 flex-col">
      <AnimatePresence mode="wait">
        {email ? (
          <motion.div
            key={email.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-full flex-col"
          >
            {/* Toolbar */}
            <Toolbar
              email={email}
              onArchive={() => archive(email.id)}
              onDelete={() => remove(email.id)}
              onStar={() => toggleStar(email.id)}
              onToggleAssistant={toggleAssistant}
            />

            {/* Article */}
            <article className="scrollbar-elegant flex-1 overflow-y-auto">
              <div className="mx-auto max-w-[640px] px-8 pt-10 pb-28">

                {/* Subject */}
                <h1 className="text-[20px] font-semibold leading-snug tracking-tight text-foreground mb-5">
                  {email.subject}
                </h1>

                {/* Sender meta */}
                <div className="flex items-center gap-3 pb-5 border-b border-border mb-6">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted text-[11px] font-semibold text-foreground/70">
                    {email.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[13px] font-medium">{email.senderName}</span>
                      <span className="text-[11.5px] text-muted-foreground">
                        &lt;{email.senderEmail}&gt;
                      </span>
                    </div>
                    <p className="text-[11.5px] text-muted-foreground mt-0.5">
                      to me · <ReceivedAt date={email.receivedAt} />
                    </p>
                  </div>
                </div>

                {/* AI Summary */}
                <AiSummary email={email} />

                {/* Body */}
                <div className="mt-6">
                  {email.body.split("\n\n").map((p, i) => (
                    <Paragraph key={i} text={p} />
                  ))}
                </div>

                {/* Attachments */}
                {email.attachments && email.attachments.length > 0 && (
                  <div className="mt-10 pt-6 border-t border-border">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                      Attachments
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {email.attachments.map((a) => (
                        <div
                          key={a.name}
                          className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/30"
                        >
                          <div className="grid h-8 w-8 place-items-center rounded-md border border-border bg-muted/40 text-muted-foreground">
                            <Paperclip className="h-3.5 w-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[12px] font-medium">{a.name}</p>
                            <p className="text-[10.5px] text-muted-foreground">{a.size}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reply box */}
                <ReplyComposer />
              </div>
            </article>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center"
          >
            <div className="grid h-11 w-11 place-items-center rounded-2xl border border-border text-muted-foreground">
              <Inbox className="h-5 w-5" />
            </div>
            <p className="text-[13.5px] font-medium">No message selected</p>
            <p className="max-w-xs text-[12px] leading-relaxed text-muted-foreground">
              Pick a thread from the list, or press{" "}
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                ⌘K
              </kbd>{" "}
              to search.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Toolbar({
  email, onArchive, onDelete, onStar, onToggleAssistant,
}: {
  email: Email;
  onArchive: () => void;
  onDelete: () => void;
  onStar: () => void;
  onToggleAssistant: () => void;
}) {
  return (
    <div className="sticky top-0 z-10 flex h-11 items-center gap-px border-b border-border bg-background/90 px-3 backdrop-blur-xl">
      {/* Action group */}
      <Btn icon={Reply} label="Reply" />
      <Btn icon={ReplyAll} label="Reply all" />
      <Btn icon={Forward} label="Forward" />
      <Sep />
      <Btn icon={Archive} label="Archive" onClick={onArchive} />
      <Btn icon={Trash2} label="Delete" onClick={onDelete} />
      <Btn icon={Star} label={email.starred ? "Unstar" : "Star"} active={email.starred} onClick={onStar} />
      <Sep />

      {/* AI group */}
      <TextBtn icon={Sparkles} label="Summarize" />
      <TextBtn icon={Wand2} label="Rewrite" />
      <TextBtn icon={Languages} label="Translate" />

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-px">
        <Btn icon={MoreHorizontal} label="More" />
        <Btn icon={PanelRight} label="Toggle assistant" onClick={onToggleAssistant} />
      </div>
    </div>
  );
}

function Btn({ icon: Icon, label, onClick, active }: {
  icon: typeof Reply; label: string; onClick?: () => void; active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "grid h-7 w-7 place-items-center rounded-md transition-colors",
        active
          ? "text-foreground bg-muted"
          : "text-muted-foreground/60 hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className={cn("h-3.5 w-3.5", active && "fill-current")} />
    </button>
  );
}

function TextBtn({ icon: Icon, label }: { icon: typeof Sparkles; label: string }) {
  return (
    <button
      title={label}
      className="flex h-7 items-center gap-1 rounded-md px-2 text-[11.5px] font-medium text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
    >
      <Icon className="h-3 w-3" />
      {label}
    </button>
  );
}

function Sep() {
  return <span className="mx-0.5 h-4 w-px bg-border" />;
}

function AiSummary({ email }: { email: Email }) {
  const summaries: Record<string, string> = {
    "email-1": "Elena needs your input on Q4 priorities — billing migration, identity unification, and internal tooling. Reply by Friday to keep Monday kickoff.",
    "email-3": "Marcus's virtualizer benchmarks landed: 3.2 ms render at 10k messages, memory down 64%. PR ready, targeting Tuesday ship.",
    "email-6": "Amelia (a16z) is asking for a 30-min intro call Wed or Thu, referred by James.",
  };
  const text = summaries[email.id];
  if (!text) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="flex gap-3 p-3 rounded-lg bg-muted/30 border border-border/50 mb-2"
    >
      <div className="shrink-0 mt-0.5">
        <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          AI summary
        </p>
        <p className="text-[12.5px] leading-relaxed text-foreground/80">{text}</p>
      </div>
    </motion.div>
  );
}

function Paragraph({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p className="mt-4 whitespace-pre-line text-[13.5px] leading-[1.8] text-foreground/85 first:mt-0">
      {parts.map((p, i) =>
        p.startsWith("**") ? (
          <strong key={i} className="font-semibold text-foreground">{p.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </p>
  );
}

function ReplyComposer() {
  const suggestions = [
    "Sounds good — let's lock it.",
    "Can you share a brief?",
    "I'll review and get back to you.",
  ];
  return (
    <div className="mt-10 rounded-xl border border-border overflow-hidden">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-2 bg-muted/20">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Reply
        </p>
        <button className="flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Sparkles className="h-3 w-3" />
          AI draft
        </button>
      </div>
      <textarea
        placeholder="Write a reply…"
        rows={4}
        className="w-full resize-none bg-transparent px-4 py-3 text-[13px] leading-relaxed placeholder:text-muted-foreground/40 focus:outline-none"
      />
      <div className="flex flex-wrap items-center gap-1.5 border-t border-border/60 px-4 py-2 bg-muted/10">
        {suggestions.map((s) => (
          <button
            key={s}
            className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
          >
            {s}
          </button>
        ))}
        <button className="ml-auto h-7 rounded-lg bg-foreground px-3.5 text-[11.5px] font-medium text-background transition-opacity hover:opacity-80">
          Send
        </button>
      </div>
    </div>
  );
}
