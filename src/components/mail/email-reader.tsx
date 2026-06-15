import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Reply,
  ReplyAll,
  Forward,
  Archive,
  Trash2,
  Star,
  Sparkles,
  Languages,
  Wand2,
  MoreHorizontal,
  Paperclip,
  Inbox,
  PanelRight,
  Send,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { type Email } from "@/lib/mock-data";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { useEmails, useEmailMutations } from "@/hooks/use-mail";
import { toast } from "sonner";

function ReceivedAt({ date }: { date: Date }) {
  const mounted = useMounted();
  if (!mounted) return <span className="opacity-0">—</span>;
  return (
    <span suppressHydrationWarning>
      {date.toLocaleString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })}
    </span>
  );
}

export function EmailReader() {
  const { selectedId, folder, search, toggleAssistant, select } = useApp();
  const { data: emails = [] } = useEmails(folder, search);
  const { archive, trash, toggleStar, sendEmail } = useEmailMutations();
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
              onArchive={() => {
                archive(email.id);
                select(null);
              }}
              onDelete={() => {
                trash(email.id);
                select(null);
              }}
              onStar={() => toggleStar(email.id, !email.starred)}
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
                <ReplyComposer email={email} />
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
  email,
  onArchive,
  onDelete,
  onStar,
  onToggleAssistant,
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
      <Btn
        icon={Star}
        label={email.starred ? "Unstar" : "Star"}
        active={email.starred}
        onClick={onStar}
      />
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

function Btn({
  icon: Icon,
  label,
  onClick,
  active,
}: {
  icon: typeof Reply;
  label: string;
  onClick?: () => void;
  active?: boolean;
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
    "email-1":
      "Elena needs your input on Q4 priorities — billing migration, identity unification, and internal tooling. Reply by Friday to keep Monday kickoff.",
    "email-3":
      "Marcus's virtualizer benchmarks landed: 3.2 ms render at 10k messages, memory down 64%. PR ready, targeting Tuesday ship.",
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
          <strong key={i} className="font-semibold text-foreground">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </p>
  );
}

function ReplyComposer({ email }: { email: Email }) {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { sendEmail } = useEmailMutations();
  const suggestions = [
    "Sounds good — let's lock it.",
    "Can you share a brief?",
    "I'll review and get back to you.",
  ];

  const handleSend = async () => {
    if (!text.trim() || !email.senderEmail) return;
    setIsSending(true);
    try {
      await sendEmail({
        to: email.senderEmail,
        subject: email.subject.startsWith("Re:") ? email.subject : `Re: ${email.subject}`,
        body: text,
      });
      toast.success("Reply sent");
      setText("");
    } catch (e) {
      toast.error("Failed to send reply");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className={cn(
        "relative mt-16 rounded-2xl border border-border/30 bg-muted/5 backdrop-blur-xl transition-all duration-500 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.01)] hover:border-border/50",
        isFocused &&
          "border-foreground/10 bg-background/95 ring-1 ring-foreground/5 shadow-[0_24px_70px_-10px_rgba(0,0,0,0.06),0_8px_24px_-8px_rgba(0,0,0,0.02)]",
      )}
    >
      {/* Textarea */}
      <textarea
        value={text}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => {
          setText(e.target.value);
          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
        placeholder={`Reply to ${email.senderName}…`}
        style={{ height: "auto", minHeight: "110px" }}
        className="w-full resize-none overflow-hidden bg-transparent px-6 pt-6 pb-2 text-[13.5px] font-normal leading-relaxed placeholder:text-muted-foreground/30 focus:outline-none text-foreground/90"
      />

      {/* Bottom Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/15 px-6 pb-4 pt-3 bg-muted/5">
        {/* Left Side: Suggestions */}
        <div className="flex flex-wrap items-center gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => {
                setText(s);
                setTimeout(() => {
                  const ta = document.querySelector(
                    "textarea[placeholder^='Reply to']",
                  ) as HTMLTextAreaElement;
                  if (ta) {
                    ta.style.height = "auto";
                    ta.style.height = `${ta.scrollHeight}px`;
                  }
                }, 0);
              }}
              className="rounded-full border border-border/30 bg-muted/30 px-3.5 py-1 text-[10.5px] font-medium tracking-wide text-muted-foreground/75 transition-all duration-300 hover:border-foreground/30 hover:text-foreground hover:bg-background hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)] active:scale-95 cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <button className="relative p-[1px] overflow-hidden rounded-full flex items-center justify-center transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer group shadow-[0_2px_12px_rgba(99,102,241,0.08)] hover:shadow-[0_4px_20px_rgba(99,102,241,0.18)]">
            {/* Spinning AI indigo gradient border */}
            <span className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#818cf8_0%,#c084fc_25%,#6366f1_50%,#c084fc_75%,#818cf8_100%)] opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 flex items-center gap-1.5 h-7.5 rounded-full bg-indigo-50/80 dark:bg-indigo-950/60 px-4 text-[10.5px] font-bold tracking-wider text-indigo-600 dark:text-indigo-300">
              {/* Soft inner glint */}
              <div className="absolute inset-0 w-[50%] h-full bg-gradient-to-r from-transparent via-white/30 dark:via-indigo-400/10 to-transparent -skew-x-12 -translate-x-[150%] group-hover:translate-x-[250%] transition-transform duration-1000 ease-out pointer-events-none" />
              <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-300 fill-indigo-600/10 dark:fill-indigo-300/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <span>AI Draft</span>
            </div>
          </button>
          <button
            disabled={isSending || !text.trim()}
            onClick={handleSend}
            className="relative overflow-hidden group flex items-center gap-1.5 h-8 px-4.5 rounded-full bg-foreground text-[10.5px] font-bold tracking-wider text-background shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:bg-foreground/90 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50 transition-all duration-300 cursor-pointer"
          >
            {/* Shimmer sweep */}
            <div className="absolute inset-0 w-[50%] h-full bg-gradient-to-r from-transparent via-white/20 dark:via-neutral-950/10 to-transparent -skew-x-12 -translate-x-[150%] group-hover:translate-x-[250%] transition-transform duration-1000 ease-out pointer-events-none" />
            <span>{isSending ? "Sending..." : "Send"}</span>
            <Send className="h-3 w-3 fill-current transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
