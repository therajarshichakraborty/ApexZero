import { AnimatePresence, motion } from "motion/react";
import { X, Paperclip, Image as ImageIcon, Clock, Sparkles, Minus } from "lucide-react";
import { useApp } from "@/lib/store";
import { useEffect } from "react";

export function ComposeModal() {
  const { composeOpen, closeCompose } = useApp();

  useEffect(() => {
    if (!composeOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCompose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [composeOpen, closeCompose]);

  return (
    <AnimatePresence>
      {composeOpen && (
        <>
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={closeCompose}
            className="fixed inset-0 z-40 bg-background/40 backdrop-blur-sm"
          />
          <motion.div
            key="dlg"
            role="dialog"
            aria-label="Compose message"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-1/2 top-1/2 z-50 w-[min(680px,92vw)] -translate-x-1/2 -translate-y-1/2"
          >
            <div className="glass overflow-hidden rounded-2xl shadow-2xl shadow-black/20">
              <header className="flex h-11 items-center justify-between border-b border-border px-4">
                <span className="text-[12px] font-medium tracking-wide text-muted-foreground">
                  New message
                </span>
                <div className="flex items-center gap-0.5">
                  <button
                    aria-label="Minimize"
                    className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={closeCompose}
                    aria-label="Close"
                    className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </header>
              <div className="flex flex-col">
                <Row label="To">
                  <input
                    autoFocus
                    placeholder="elena@stripe.com"
                    className="h-9 w-full bg-transparent text-[13.5px] placeholder:text-muted-foreground/70 focus:outline-none"
                  />
                </Row>
                <Row label="Subject">
                  <input
                    placeholder="Quick thought on the roadmap"
                    className="h-9 w-full bg-transparent text-[13.5px] font-medium placeholder:text-muted-foreground/70 focus:outline-none"
                  />
                </Row>
                <textarea
                  rows={10}
                  placeholder="Write your message…"
                  className="scrollbar-elegant min-h-[220px] w-full resize-none bg-transparent px-5 py-4 text-[14px] leading-[1.75] placeholder:text-muted-foreground/70 focus:outline-none"
                />
              </div>
              <footer className="flex items-center gap-1 border-t border-border px-3 py-2.5">
                <IconBtn icon={Paperclip} label="Attach" />
                <IconBtn icon={ImageIcon} label="Image" />
                <IconBtn icon={Clock} label="Schedule" />
                <button className="ml-1 flex h-7 items-center gap-1.5 rounded-lg border border-border bg-surface/60 px-2.5 text-[11.5px] font-medium text-muted-foreground hover:text-foreground">
                  <Sparkles className="h-3 w-3 text-primary" />
                  Improve with AI
                </button>
                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={closeCompose}
                    className="h-8 rounded-lg px-3 text-[12.5px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    Save draft
                  </button>
                  <button className="h-8 rounded-lg bg-primary px-3.5 text-[12.5px] font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                    Send
                  </button>
                </div>
              </footer>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 border-b border-border px-5">
      <span className="w-14 shrink-0 text-[11.5px] font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  );
}

function IconBtn({ icon: Icon, label }: { icon: typeof Paperclip; label: string }) {
  return (
    <button
      title={label}
      aria-label={label}
      className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}
