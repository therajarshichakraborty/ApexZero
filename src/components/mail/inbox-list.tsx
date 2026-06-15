import { Star, Search, PanelLeft } from "lucide-react";
import { useApp } from "@/lib/store";
import { formatTime, groupByDay, type Email } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useEmails, useEmailMutations } from "@/hooks/use-mail";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function InboxList() {
  const { selectedId, select, search, setSearch, folder, sidebarOpen, toggleSidebar } = useApp();
  const { data: visible = [], isPending, isError } = useEmails(folder, search);
  const { toggleStar } = useEmailMutations();
  const groups = groupByDay(visible);
  const folderLabel = folder.charAt(0).toUpperCase() + folder.slice(1);

  return (
    <div className="flex h-full w-full min-w-0 overflow-hidden flex-col border-r border-border bg-background">
      <div className="px-4 pt-4 pb-3 shrink-0 min-w-0">
        <div className="flex items-center justify-between mb-3 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={toggleSidebar}
              className={cn(
                "grid h-6 w-6 place-items-center rounded-md transition-colors",
                !sidebarOpen
                  ? "text-foreground bg-muted"
                  : "text-muted-foreground/60 hover:bg-muted hover:text-foreground",
              )}
              title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
            >
              <PanelLeft className="h-3.5 w-3.5" />
            </button>
            <h1 className="text-[13px] font-semibold tracking-tight truncate min-w-0">
              {folderLabel}
            </h1>
          </div>
          <span className="text-[11px] tabular-nums text-muted-foreground/60">
            {visible.length}
          </span>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 h-8 rounded-md border border-border bg-muted/20 px-2.5 focus-within:border-foreground/20 transition-colors">
          <Search className="h-3 w-3 shrink-0 text-muted-foreground/50" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter…"
            className="flex-1 bg-transparent text-[12px] placeholder:text-muted-foreground/40 focus:outline-none min-w-0"
          />
        </div>
      </div>

      {/* Email rows */}
      <div className="scrollbar-elegant flex-1 overflow-y-auto">
        {isPending ? (
          <Skeleton />
        ) : isError ? (
          <div className="mt-24 flex flex-col items-center gap-2 px-8 text-center">
            <p className="text-[12.5px] font-medium text-destructive">Failed to load emails</p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/connect">Connect Gmail</Link>
            </Button>
          </div>
        ) : visible.length === 0 ? (
          <Empty />
        ) : (
          (["Today", "Yesterday", "Earlier"] as const).map((g) =>
            groups[g].length === 0 ? null : (
              <div key={g}>
                {/* Day group label */}
                <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm px-4 py-1.5 border-b border-border/40">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                    {g}
                  </span>
                </div>

                {groups[g].map((email) => (
                  <EmailRow
                    key={email.id}
                    email={email}
                    active={email.id === selectedId}
                    onSelect={() => select(email.id)}
                    onStar={() => toggleStar(email.id)}
                  />
                ))}
              </div>
            ),
          )
        )}
      </div>
    </div>
  );
}

function EmailRow({
  email,
  active,
  onSelect,
  onStar,
}: {
  email: Email;
  active: boolean;
  onSelect: () => void;
  onStar: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "@container group relative w-full min-w-0 text-left border-b border-border/30 last:border-0 transition-colors cursor-pointer select-none outline-none",
        active ? "bg-muted/60" : "hover:bg-muted/30",
      )}
    >
      {/* Active indicator */}
      {active && (
        <span className="absolute left-0 inset-y-0 w-[2px] bg-foreground rounded-r-full" />
      )}

      <div className="px-4 py-3 min-w-0 w-full overflow-hidden">
        {/* Row 1: sender + time */}
        <div className="flex items-center gap-2 mb-1 min-w-0">
          {/* Tiny unread dot */}
          <span
            className={cn(
              "h-1.5 w-1.5 shrink-0 rounded-full transition-opacity",
              email.unread ? "bg-foreground" : "opacity-0",
            )}
          />
          <span
            className={cn(
              "flex-1 truncate text-[12.5px] leading-none",
              email.unread ? "font-semibold text-foreground" : "font-medium text-foreground/65",
            )}
          >
            {email.senderName}
          </span>
          <span className="shrink-0 text-[10.5px] tabular-nums text-muted-foreground/50 @[max-width:240px]:hidden">
            {formatTime(email.receivedAt)}
          </span>
        </div>

        {/* Row 2: subject */}
        <p
          className={cn(
            "pl-3.5 truncate text-[12px] leading-snug mb-0.5 min-w-0",
            email.unread ? "text-foreground/85" : "text-muted-foreground",
          )}
        >
          {email.subject}
        </p>

        {/* Row 3: preview + priority + star */}
        <div className="pl-3.5 flex items-center gap-1.5 min-w-0">
          <p className="flex-1 truncate text-[11px] text-muted-foreground/50 leading-snug min-w-0">
            {email.preview}
          </p>
          <ScoreChip score={email.aiPriority} className="@[max-width:210px]:hidden" />
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onStar();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                onStar();
              }
            }}
            aria-label={email.starred ? "Unstar" : "Star"}
            className={cn(
              "grid h-5 w-5 shrink-0 place-items-center rounded transition-all cursor-pointer @[max-width:210px]:hidden",
              email.starred
                ? "text-foreground opacity-100"
                : "text-muted-foreground/30 opacity-0 group-hover:opacity-100",
            )}
          >
            <Star className={cn("h-3 w-3", email.starred && "fill-current")} />
          </span>
        </div>
      </div>
    </div>
  );
}

function ScoreChip({ score, className }: { score: number; className?: string }) {
  if (score < 60) return null; // only show for meaningful scores
  return (
    <span
      className={cn(
        "shrink-0 rounded px-1.5 py-px text-[9.5px] font-medium tabular-nums border",
        score >= 85
          ? "text-foreground/80 border-foreground/20 bg-foreground/5"
          : "text-muted-foreground border-border/60",
        className,
      )}
    >
      {score}
    </span>
  );
}

function Skeleton() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="px-4 py-3 border-b border-border/30"
          style={{ opacity: 1 - i * 0.12 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1.5 w-1.5 rounded-full bg-muted" />
            <div className="h-2 w-1/3 rounded-full bg-muted/70" />
            <div className="ml-auto h-2 w-8 rounded-full bg-muted/50" />
          </div>
          <div className="pl-3.5 space-y-1.5">
            <div className="h-2 w-2/3 rounded-full bg-muted/60" />
            <div className="h-2 w-full rounded-full bg-muted/40" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Empty() {
  return (
    <div className="mt-24 flex flex-col items-center gap-2 px-8 text-center">
      <div className="grid h-9 w-9 place-items-center rounded-xl border border-border text-muted-foreground">
        <Search className="h-4 w-4" />
      </div>
      <p className="text-[12.5px] font-medium text-foreground/70">Nothing here</p>
      <p className="text-[11.5px] leading-relaxed text-muted-foreground">
        Try adjusting your filters.
      </p>
    </div>
  );
}
