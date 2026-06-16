import { motion } from "motion/react";
import Link from "next/link";
import { UserButton } from "@/components/auth/user-button";
import { useAuth } from "@/hooks/use-auth";
import { useMailPrefetch } from "@/hooks/use-mail";
import {
  Inbox,
  Star,
  Send,
  FileText,
  Archive,
  Trash2,
  Sparkles,
  Search,
  PenSquare,
  Settings,
  ShieldAlert,
  Sun,
  Moon,
  CalendarDays,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useApp, type Folder } from "@/lib/store";

const NAV: { id: Folder; label: string; icon: typeof Inbox; shortcut?: string }[] = [
  { id: "inbox", label: "Inbox", icon: Inbox, shortcut: "G I" },
  { id: "important", label: "Important", icon: Sparkles },
  { id: "starred", label: "Starred", icon: Star },
  { id: "sent", label: "Sent", icon: Send },
  { id: "drafts", label: "Drafts", icon: FileText },
  { id: "archive", label: "Archive", icon: Archive },
  { id: "spam", label: "Spam", icon: ShieldAlert },
  { id: "trash", label: "Trash", icon: Trash2 },
];

export function Sidebar({ hideHeader = false }: { hideHeader?: boolean }) {
  const { user } = useAuth();
  const { folder, setFolder, openCompose, openPalette } = useApp();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const prefetch = useMailPrefetch();
  useEffect(() => setMounted(true), []);

  // TODO: Fetch real unread counts via Gmail Labels API
  const count = (id: Folder) => {
    return 0;
  };

  return (
    <aside className="flex h-full w-full flex-col py-3 px-2">
      {!hideHeader && (
        <div className="flex items-center gap-2 px-2 pb-4">
          <div className="grid h-6 w-6 place-items-center rounded-md bg-foreground text-background text-[11px] font-bold">
            AZ
          </div>
          <span className="text-[13.5px] font-semibold tracking-tight">ApexZero</span>
        </div>
      )}

      {/* Compose */}
      <button
        onClick={openCompose}
        className="mb-1 flex h-8 items-center gap-2 rounded-md bg-foreground px-3 text-[12.5px] font-medium text-background transition-opacity hover:opacity-80 active:scale-[0.98]"
      >
        <PenSquare className="h-3.5 w-3.5 shrink-0" />
        <span>Compose</span>
        <kbd className="ml-auto text-[9.5px] font-mono text-background/50">press 'c'</kbd>
      </button>

      {/* Search */}
      <button
        onClick={openPalette}
        className="mb-4 flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[12px] text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
      >
        <Search className="h-3.5 w-3.5 shrink-0" />
        <span>Search</span>
        <kbd className="ml-auto font-mono text-[10px] text-muted-foreground/50">⌘K</kbd>
      </button>

      {/* Nav section label */}
      <p className="mb-1 px-2.5 text-[9.5px] font-semibold uppercase tracking-widest text-muted-foreground/50">
        Folders
      </p>

      {/* Nav items */}
      <nav className="flex flex-col gap-px">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = folder === item.id;
          const c = count(item.id);
          return (
            <button
              key={item.id}
              onClick={() => setFolder(item.id)}
              onMouseEnter={() => prefetch(item.id)}
              className={cn(
                "group relative flex h-7 items-center gap-2 rounded-md px-2.5 text-[12.5px] transition-colors",
                active
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
              )}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-pill"
                  className="absolute inset-0 rounded-md bg-muted"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
              <Icon className="relative z-10 h-3.5 w-3.5 shrink-0" />
              <span className={cn("relative z-10", active ? "font-medium" : "font-normal")}>
                {item.label}
              </span>
              {c > 0 && (
                <span
                  className={cn(
                    "relative z-10 ml-auto text-[10.5px] tabular-nums",
                    active ? "font-medium text-foreground" : "text-muted-foreground/60",
                  )}
                >
                  {c}
                </span>
              )}
            </button>
          );
        })}

        <div className="my-2 mx-2 h-px bg-border/50" />

        <Link
          href="/calendar"
          className="flex h-7 items-center gap-2 rounded-md px-2.5 text-[12.5px] text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
        >
          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
          <span className="font-normal">Calendar</span>
          <span className="ml-auto rounded px-1 py-px text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/60 border border-border/60">
            New
          </span>
        </Link>
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-4 flex flex-col gap-3">
        {/* AI meter */}
        <div className="rounded-lg bg-muted/30 p-2.5 border border-border/50">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10.5px] font-medium text-foreground/70">AI usage</span>
            <span className="text-[10px] tabular-nums text-muted-foreground">412 / 1k</span>
          </div>
          <div className="h-[3px] rounded-full bg-border overflow-hidden">
            <div className="h-full rounded-full bg-foreground/40" style={{ width: "41%" }} />
          </div>
          <p className="mt-1.5 text-[10px] text-muted-foreground/60">Resets in 19 days</p>
        </div>

        {/* User row */}
        <div className="flex items-center gap-1.5 px-0.5">
          <UserButton align="start" side="top" sideOffset={12} />
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="truncate text-[11.5px] font-medium leading-tight">
              {user?.name ?? "Alex Kim"}
            </p>
            <p className="truncate text-[10.5px] leading-tight text-muted-foreground">
              {user?.email ?? "alex@apexzero.app"}
            </p>
          </div>
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border/40 text-muted-foreground/60 transition-all duration-300 hover:bg-muted hover:text-foreground hover:scale-105 active:scale-95 cursor-pointer group/theme"
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="h-3.5 w-3.5 transition-transform duration-500 group-hover/theme:rotate-45" />
            ) : (
              <Moon className="h-3.5 w-3.5 transition-transform duration-500 group-hover/theme:-rotate-12" />
            )}
          </button>
          <Link
            href="/connect"
            aria-label="Integrations & Settings"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border/40 text-muted-foreground/60 transition-all duration-300 hover:bg-muted hover:text-foreground hover:scale-105 active:scale-95 cursor-pointer group/settings"
          >
            <Settings className="h-3.5 w-3.5 transition-transform duration-500 group-hover/settings:rotate-45" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
