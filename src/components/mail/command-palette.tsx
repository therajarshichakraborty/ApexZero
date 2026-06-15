import { AnimatePresence, motion } from "motion/react";
import { Command } from "cmdk";
import {
  Search,
  Inbox,
  Star,
  Archive,
  Trash2,
  PenSquare,
  Sparkles,
  FileText,
  Send,
  ShieldAlert,
  Wand2,
  Languages,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { useEffect } from "react";
import { useEmails } from "@/hooks/use-mail";

export function CommandPalette() {
  const {
    paletteOpen,
    closePalette,
    openPalette,
    togglePalette,
    setFolder,
    openCompose,
    select,
    folder,
  } = useApp();

  const { data: emails = [] } = useEmails(folder);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        togglePalette();
      } else if (!paletteOpen && e.key.toLowerCase() === "c" && !isTyping(e)) {
        openCompose();
      } else if (e.key === "Escape" && paletteOpen) {
        closePalette();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen, togglePalette, openCompose, openPalette, closePalette]);

  const run = (fn: () => void) => () => {
    fn();
    closePalette();
  };

  return (
    <AnimatePresence>
      {paletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={closePalette}
            className="fixed inset-0 z-50 bg-background/40 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-1/2 top-[18vh] z-50 w-[min(620px,92vw)] -translate-x-1/2"
          >
            <Command loop className="glass overflow-hidden rounded-2xl shadow-2xl shadow-black/30">
              <div className="flex h-12 items-center gap-2.5 border-b border-border px-4">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Command.Input
                  placeholder="Search messages, run a command, ask AI…"
                  className="h-full flex-1 bg-transparent text-[13.5px] placeholder:text-muted-foreground/70 focus:outline-none"
                />
                <kbd className="rounded-md border border-border bg-muted/50 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  esc
                </kbd>
              </div>
              <Command.List className="scrollbar-elegant max-h-[420px] overflow-y-auto p-2">
                <Command.Empty className="px-3 py-8 text-center text-[12.5px] text-muted-foreground">
                  No results.
                </Command.Empty>

                <Group heading="Actions">
                  <Item
                    icon={PenSquare}
                    label="Compose new message"
                    shortcut="C"
                    onSelect={run(openCompose)}
                  />
                  <Item icon={Sparkles} label="Ask AI about my inbox" onSelect={run(() => {})} />
                  <Item icon={Wand2} label="Improve the current draft" onSelect={run(() => {})} />
                  <Item
                    icon={Languages}
                    label="Translate selected email"
                    onSelect={run(() => {})}
                  />
                </Group>

                <Group heading="Navigate">
                  <Item icon={Inbox} label="Go to Inbox" onSelect={run(() => setFolder("inbox"))} />
                  <Item
                    icon={Star}
                    label="Go to Starred"
                    onSelect={run(() => setFolder("starred"))}
                  />
                  <Item icon={Send} label="Go to Sent" onSelect={run(() => setFolder("sent"))} />
                  <Item
                    icon={FileText}
                    label="Go to Drafts"
                    onSelect={run(() => setFolder("drafts"))}
                  />
                  <Item
                    icon={Archive}
                    label="Go to Archive"
                    onSelect={run(() => setFolder("archive"))}
                  />
                  <Item
                    icon={ShieldAlert}
                    label="Go to Spam"
                    onSelect={run(() => setFolder("spam"))}
                  />
                  <Item
                    icon={Trash2}
                    label="Go to Trash"
                    onSelect={run(() => setFolder("trash"))}
                  />
                </Group>

                <Group heading="Messages">
                  {emails.slice(0, 6).map((e) => (
                    <Command.Item
                      key={e.id}
                      value={`message ${e.senderName} ${e.subject}`}
                      onSelect={run(() => select(e.id))}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] data-[selected=true]:bg-muted"
                    >
                      <div
                        className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[9.5px] font-semibold text-white"
                        style={{ background: e.avatarColor }}
                      >
                        {e.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{e.subject}</p>
                        <p className="truncate text-[11.5px] text-muted-foreground">
                          {e.senderName}
                        </p>
                      </div>
                    </Command.Item>
                  ))}
                </Group>
              </Command.List>
              <footer className="flex h-9 items-center justify-between border-t border-border px-4 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Kbd>↑</Kbd>
                    <Kbd>↓</Kbd>
                    to navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <Kbd>↵</Kbd>
                    to select
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-primary" />
                  Corsior intelligence
                </span>
              </footer>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Group({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <Command.Group
      heading={heading}
      className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted-foreground"
    >
      {children}
    </Command.Group>
  );
}

function Item({
  icon: Icon,
  label,
  shortcut,
  onSelect,
}: {
  icon: typeof Inbox;
  label: string;
  shortcut?: string;
  onSelect: () => void;
}) {
  return (
    <Command.Item
      value={label}
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] data-[selected=true]:bg-muted"
    >
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <span>{label}</span>
      {shortcut && (
        <kbd className="ml-auto rounded-md border border-border bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          {shortcut}
        </kbd>
      )}
    </Command.Item>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded-md border border-border bg-muted/40 px-1.5 py-0.5 font-mono text-[10px]">
      {children}
    </kbd>
  );
}

function isTyping(e: KeyboardEvent) {
  const t = e.target as HTMLElement | null;
  if (!t) return false;
  const tag = t.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || t.isContentEditable;
}
