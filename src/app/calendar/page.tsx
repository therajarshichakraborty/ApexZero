"use client";

import Link from "next/link";
import { UserButton } from "@/components/auth/user-button";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  MapPin,
  Inbox,
  CalendarDays,
  Settings,
  Search,
  X,
} from "lucide-react";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import {
  events as initialEvents,
  colorTokens,
  startOfWeek,
  addDays,
  sameDay,
  fmtHour,
  type CalEvent,
} from "@/lib/calendar-data";

export default function CalendarPage() {
  const [cursor, setCursor] = useState(() => new Date());
  const [eventsList, setEventsList] = useState<CalEvent[]>(() => initialEvents);
  const [selectedEvent, setSelectedEvent] = useState<CalEvent | null>(null);
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);

  const [newEventData, setNewEventData] = useState({
    title: "",
    date: "",
    startHour: "09",
    startMinute: "00",
    endHour: "10",
    endMinute: "00",
    location: "",
    color: "violet" as CalEvent["color"],
    kind: "meeting" as CalEvent["kind"],
    aiNote: "",
  });

  const handleOpenNewEventModal = () => {
    const yyyy = cursor.getFullYear();
    const mm = String(cursor.getMonth() + 1).padStart(2, "0");
    const dd = String(cursor.getDate()).padStart(2, "0");
    const dateStr = `${yyyy}-${mm}-${dd}`;

    setNewEventData({
      title: "",
      date: dateStr,
      startHour: "09",
      startMinute: "00",
      endHour: "10",
      endMinute: "00",
      location: "",
      color: "violet",
      kind: "meeting",
      aiNote: "",
    });
    setIsNewEventModalOpen(true);
  };

  const handleSlotClick = (day: Date, hour: number) => {
    const yyyy = day.getFullYear();
    const mm = String(day.getMonth() + 1).padStart(2, "0");
    const dd = String(day.getDate()).padStart(2, "0");
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const startHourStr = String(hour).padStart(2, "0");
    const endHourStr = String((hour + 1) % 24).padStart(2, "0");

    setNewEventData({
      title: "",
      date: dateStr,
      startHour: startHourStr,
      startMinute: "00",
      endHour: endHourStr,
      endMinute: "00",
      location: "",
      color: "violet",
      kind: "meeting",
      aiNote: "",
    });
    setIsNewEventModalOpen(true);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventData.title.trim()) return;

    const [year, month, day] = newEventData.date.split("-").map(Number);
    const start = new Date(
      year,
      month - 1,
      day,
      Number(newEventData.startHour),
      Number(newEventData.startMinute),
    );
    const end = new Date(
      year,
      month - 1,
      day,
      Number(newEventData.endHour),
      Number(newEventData.endMinute),
    );

    const newEvent: CalEvent = {
      id: `custom-${Date.now()}`,
      title: newEventData.title,
      start,
      end,
      location: newEventData.location || undefined,
      color: newEventData.color,
      kind: newEventData.kind,
      aiNote: newEventData.aiNote || undefined,
      attendees: [{ name: "Alex Kim", initials: "AK", color: "oklch(0.65 0.13 258)" }],
    };

    setEventsList((prev) => [...prev, newEvent]);
    setIsNewEventModalOpen(false);
  };

  const handleDeleteEvent = (id: string) => {
    setEventsList((prev) => prev.filter((item) => item.id !== id));
    setSelectedEvent(null);
  };

  return (
    <div className="ambient-bg h-dvh w-screen overflow-hidden">
      <main className="flex h-full">
        <CalSidebar
          cursor={cursor}
          setCursor={setCursor}
          onOpenNewEventModal={handleOpenNewEventModal}
        />
        <div className="flex h-full min-w-0 flex-1 overflow-hidden rounded-tl-2xl border-l border-t border-border bg-surface/40">
          <WeekSurface
            cursor={cursor}
            setCursor={setCursor}
            eventsList={eventsList}
            setSelectedEvent={setSelectedEvent}
            onSlotClick={handleSlotClick}
          />
          <DayDetails
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        </div>
      </main>

      <AnimatePresence>
        {isNewEventModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3.5 bg-surface/30">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-[14px] font-semibold text-foreground">
                    Create New Event
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewEventModalOpen(false)}
                  className="grid h-6 w-6 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="p-4 space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Event Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Weekly Product Sync"
                    value={newEventData.title}
                    onChange={(e) => setNewEventData({ ...newEventData, title: e.target.value })}
                    className="w-full h-9 rounded-lg border border-border bg-surface/50 px-3 text-[13px] text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Type
                    </label>
                    <select
                      value={newEventData.kind}
                      onChange={(e) =>
                        setNewEventData({
                          ...newEventData,
                          kind: e.target.value as CalEvent["kind"],
                        })
                      }
                      className="w-full h-9 rounded-lg border border-border bg-surface/50 px-2.5 text-[13px] text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                    >
                      <option value="meeting">Meeting</option>
                      <option value="focus">Focus Block</option>
                      <option value="review">Design Review</option>
                      <option value="personal">Personal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Color Theme
                    </label>
                    <select
                      value={newEventData.color}
                      onChange={(e) =>
                        setNewEventData({
                          ...newEventData,
                          color: e.target.value as CalEvent["color"],
                        })
                      }
                      className="w-full h-9 rounded-lg border border-border bg-surface/50 px-2.5 text-[13px] text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                    >
                      <option value="violet">Violet</option>
                      <option value="blue">Blue</option>
                      <option value="amber">Amber</option>
                      <option value="emerald">Emerald</option>
                      <option value="rose">Rose</option>
                      <option value="slate">Slate</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={newEventData.date}
                      onChange={(e) => setNewEventData({ ...newEventData, date: e.target.value })}
                      className="w-full h-9 rounded-lg border border-border bg-surface/50 px-2.5 text-[12px] text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Start Time
                    </label>
                    <select
                      value={newEventData.startHour}
                      onChange={(e) =>
                        setNewEventData({ ...newEventData, startHour: e.target.value })
                      }
                      className="w-full h-9 rounded-lg border border-border bg-surface/50 px-1 text-[13px] text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                    >
                      {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0")).map((h) => (
                        <option key={h} value={h}>
                          {h}:00
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      End Time
                    </label>
                    <select
                      value={newEventData.endHour}
                      onChange={(e) =>
                        setNewEventData({ ...newEventData, endHour: e.target.value })
                      }
                      className="w-full h-9 rounded-lg border border-border bg-surface/50 px-1 text-[13px] text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                    >
                      {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0")).map((h) => (
                        <option key={h} value={h}>
                          {h}:00
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Location / Link
                  </label>
                  <input
                    type="text"
                    placeholder="E.g. Zoom, Figma, HQ Room 2"
                    value={newEventData.location}
                    onChange={(e) => setNewEventData({ ...newEventData, location: e.target.value })}
                    className="w-full h-9 rounded-lg border border-border bg-surface/50 px-3 text-[13px] text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    AI Note / Details
                  </label>
                  <textarea
                    placeholder="Describe context or add agenda..."
                    value={newEventData.aiNote}
                    onChange={(e) => setNewEventData({ ...newEventData, aiNote: e.target.value })}
                    className="w-full h-20 rounded-lg border border-border bg-surface/50 p-2.5 text-[13px] text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-none"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsNewEventModalOpen(false)}
                    className="flex-1 h-9 rounded-lg border border-border bg-surface/60 text-[13px] font-medium text-foreground hover:bg-surface transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-9 rounded-lg bg-primary text-[13px] font-medium text-primary-foreground hover:bg-primary/95 transition-all shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset] cursor-pointer"
                  >
                    Create Event
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface CalSidebarProps {
  cursor: Date;
  setCursor: (d: Date) => void;
  onOpenNewEventModal: () => void;
}

function CalSidebar({ cursor, setCursor, onOpenNewEventModal }: CalSidebarProps) {
  const { user } = useAuth();
  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col px-3 py-4">
      <div className="flex items-center gap-2 px-3 pt-2 pb-5">
        <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-sm">
          <span className="text-[13px] font-semibold tracking-tight">C</span>
        </div>
        <span className="text-[15px] font-semibold tracking-tight">ApexZero</span>
        <span className="ml-auto rounded-md border border-border bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Beta
        </span>
      </div>

      <button
        onClick={onOpenNewEventModal}
        className="group flex h-10 items-center gap-2.5 rounded-xl bg-primary px-3.5 text-[13.5px] font-medium text-primary-foreground shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_4px_14px_-4px_rgb(0_0_0/0.25)] transition-all hover:-translate-y-px hover:shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_8px_22px_-6px_rgb(0_0_0/0.3)] cursor-pointer"
      >
        <Plus className="h-4 w-4" />
        <span>New event</span>
        <kbd className="ml-auto rounded-md bg-black/15 px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-primary-foreground/80">
          E
        </kbd>
      </button>

      <button className="mt-2 flex h-9 items-center gap-2.5 rounded-xl border border-border bg-surface/60 px-3 text-[13px] text-muted-foreground transition-colors hover:bg-surface">
        <Search className="h-3.5 w-3.5" />
        <span>Find a time</span>
        <kbd className="ml-auto rounded-md border border-border bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          ⌘K
        </kbd>
      </button>

      <nav className="mt-5 flex flex-col gap-0.5">
        <Link
          href="/"
          className="flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-[13px] text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
        >
          <Inbox className="h-3.5 w-3.5" />
          <span className="font-medium">Mail</span>
        </Link>
        <div className="relative flex h-8 items-center gap-2.5 rounded-lg bg-muted/70 px-2.5 text-[13px] text-foreground">
          <CalendarDays className="h-3.5 w-3.5" />
          <span className="font-medium">Calendar</span>
        </div>
      </nav>

      <div className="mt-6">
        <MiniMonth cursor={cursor} setCursor={setCursor} />
      </div>

      <div className="mt-6 px-1">
        <p className="px-2 pb-2 text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground">
          People
        </p>
        <div className="space-y-1">
          {[
            { initials: "RS", name: "Rajeev Singh" },
            { initials: "JD", name: "Jane Doe" },
            { initials: "MP", name: "Marcus Price" },
          ].map((person) => (
            <div
              key={person.initials}
              className="flex h-7 items-center gap-2 rounded-md px-2 transition-colors hover:bg-muted/50"
            >
              <div className="grid h-5 w-5 place-items-center rounded-full bg-muted text-[9px] font-medium text-muted-foreground">
                {person.initials}
              </div>
              <span className="text-[13px] font-medium text-foreground">{person.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-4">
        <div className="flex items-center gap-2 px-1">
          <UserButton />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12.5px] font-medium leading-tight">
              {user?.name ?? "Alex Kim"}
            </p>
            <p className="truncate text-[11px] leading-tight text-muted-foreground">
              {user?.email ?? "alex@corsior.com"}
            </p>
          </div>
          <button
            aria-label="Settings"
            className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Settings className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

interface MiniMonthProps {
  cursor: Date;
  setCursor: (d: Date) => void;
}

function MiniMonth({ cursor, setCursor }: MiniMonthProps) {
  const firstDay = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const lastDay = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const isSelectedDay = (d: number) => {
    return cursor.getDate() === d;
  };

  const isToday = (d: number) => {
    const todayDate = new Date();
    return (
      todayDate.getDate() === d &&
      todayDate.getMonth() === cursor.getMonth() &&
      todayDate.getFullYear() === cursor.getFullYear()
    );
  };

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between px-2">
        <span className="text-[12px] font-semibold text-foreground">
          {cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() =>
              setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, cursor.getDate()))
            }
            className="grid h-5 w-5 place-items-center rounded text-muted-foreground transition-colors hover:bg-muted cursor-pointer"
          >
            <ChevronLeft className="h-3 w-3" />
          </button>
          <button
            onClick={() =>
              setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, cursor.getDate()))
            }
            className="grid h-5 w-5 place-items-center rounded text-muted-foreground transition-colors hover:bg-muted cursor-pointer"
          >
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 px-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            className="grid h-6 place-items-center text-[10px] font-medium text-muted-foreground"
          >
            {d}
          </div>
        ))}

        {days.map((day, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (day) {
                setCursor(new Date(cursor.getFullYear(), cursor.getMonth(), day));
              }
            }}
            className={cn(
              "grid h-6 place-items-center rounded text-[11px] font-medium transition-colors",
              day === null
                ? "cursor-default"
                : isSelectedDay(day)
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : isToday(day)
                    ? "border border-primary/50 text-foreground"
                    : "text-foreground hover:bg-muted/50 cursor-pointer",
            )}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
}

interface WeekSurfaceProps {
  cursor: Date;
  setCursor: (d: Date) => void;
  eventsList: CalEvent[];
  setSelectedEvent: (e: CalEvent | null) => void;
  onSlotClick: (day: Date, hour: number) => void;
}

function WeekSurface({
  cursor,
  setCursor,
  eventsList,
  setSelectedEvent,
  onSlotClick,
}: WeekSurfaceProps) {
  const mounted = useMounted();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 640;
    }
  }, []);

  const weekStart = useMemo(() => {
    return startOfWeek(cursor);
  }, [cursor]);

  const week = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  const hourSlots = Array.from({ length: 24 }, (_, i) => i);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalEvent[]>();
    week.forEach((day) => {
      const dayKey = day.toDateString();
      map.set(
        dayKey,
        eventsList.filter((e) => sameDay(e.start, day)),
      );
    });
    return map;
  }, [week, eventsList]);

  const dateRangeLabel = useMemo(() => {
    const first = week[0];
    const last = week[6];
    if (first.getMonth() === last.getMonth()) {
      return first.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    } else if (first.getFullYear() === last.getFullYear()) {
      return `${first.toLocaleDateString("en-US", { month: "short" })} - ${last.toLocaleDateString("en-US", { month: "short", year: "numeric" })}`;
    } else {
      return `${first.toLocaleDateString("en-US", { month: "short", year: "numeric" })} - ${last.toLocaleDateString("en-US", { month: "short", year: "numeric" })}`;
    }
  }, [week]);

  const handlePrevWeek = () => {
    setCursor(addDays(cursor, -7));
  };

  const handleNextWeek = () => {
    setCursor(addDays(cursor, 7));
  };

  const handleToday = () => {
    setCursor(new Date());
  };

  if (!mounted) return null;

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-3">
          <h2 className="text-[14px] font-semibold tracking-tight text-foreground">
            {dateRangeLabel}
          </h2>
          <button
            onClick={handleToday}
            className="rounded-lg border border-border bg-surface/80 px-2.5 py-1 text-xs font-medium text-foreground transition-all hover:bg-surface hover:border-border-strong active:scale-95 cursor-pointer"
          >
            Today
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrevWeek}
            aria-label="Previous week"
            className="grid h-7 w-7 place-items-center rounded-lg border border-border bg-surface/80 text-muted-foreground transition-all hover:bg-surface hover:text-foreground active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleNextWeek}
            aria-label="Next week"
            className="grid h-7 w-7 place-items-center rounded-lg border border-border bg-surface/80 text-muted-foreground transition-all hover:bg-surface hover:text-foreground active:scale-95 cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-elegant">
        <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="grid grid-cols-8 gap-px">
            <div className="border-r border-border px-3 py-3 text-xs font-medium text-muted-foreground">
              Time
            </div>
            {week.map((day) => {
              const todayDate = new Date();
              const isCurrentDay = sameDay(day, todayDate);
              return (
                <div
                  key={day.toDateString()}
                  className="border-r border-border px-3 py-3 text-center"
                >
                  <p className="text-xs font-semibold text-foreground">
                    {day.toLocaleDateString("en-US", { weekday: "short" })}
                  </p>
                  <p
                    className={cn(
                      "text-sm font-bold mt-0.5 mx-auto grid h-6 w-6 place-items-center rounded-full",
                      isCurrentDay
                        ? "bg-primary text-primary-foreground font-black"
                        : "text-primary",
                    )}
                  >
                    {day.getDate()}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-8 gap-px">
          <div className="border-r border-border bg-muted/20">
            {hourSlots.map((hour) => {
              const d = new Date();
              d.setHours(hour, 0, 0, 0);
              return (
                <div
                  key={hour}
                  className="border-b border-border px-3 py-2 text-[11px] font-medium text-muted-foreground h-20"
                >
                  {fmtHour(d)}
                </div>
              );
            })}
          </div>

          {week.map((day) => (
            <div key={day.toDateString()} className="border-r border-border">
              {hourSlots.map((hour) => {
                const dayKey = day.toDateString();
                const dayEvents = eventsByDay.get(dayKey) || [];
                const hourEvents = dayEvents.filter((e) => e.start.getHours() === hour);

                return (
                  <div
                    key={`${day.toDateString()}-${hour}`}
                    onClick={() => {
                      if (hourEvents.length === 0) {
                        onSlotClick(day, hour);
                      }
                    }}
                    className="border-b border-border h-20 relative p-1 group hover:bg-muted/10 transition-colors cursor-pointer"
                  >
                    {hourEvents.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
                        <Plus className="h-4 w-4 text-muted-foreground/60" />
                      </div>
                    )}

                    {hourEvents.map((event) => {
                      const color = colorTokens[event.color] || colorTokens.violet;
                      return (
                        <motion.button
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(event);
                          }}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={cn(
                            "w-full h-full rounded-lg p-1.5 text-left text-[11px] font-medium transition-all hover:shadow-md cursor-pointer border flex flex-col justify-between overflow-hidden",
                            color.bg,
                            color.border,
                            color.text,
                          )}
                        >
                          <p className="truncate font-semibold text-[11px] leading-tight">
                            {event.title}
                          </p>
                          <p className="truncate text-[9.5px] opacity-75 leading-none">
                            {event.attendees?.[0]?.name || event.location || "No attendees"}
                          </p>
                        </motion.button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface DayDetailsProps {
  selectedEvent: CalEvent | null;
  setSelectedEvent: (e: CalEvent | null) => void;
  onDeleteEvent: (id: string) => void;
}

function DayDetails({ selectedEvent, setSelectedEvent, onDeleteEvent }: DayDetailsProps) {
  const mounted = useMounted();

  if (!mounted) return null;

  return (
    <div className="w-80 border-l border-border bg-background/40 p-4 overflow-y-auto scrollbar-elegant">
      {selectedEvent ? (
        <div>
          <button
            onClick={() => setSelectedEvent(null)}
            className="mb-4 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-3 w-3" />
            <span>Back to list</span>
          </button>

          {(() => {
            const color = colorTokens[selectedEvent.color] || colorTokens.violet;
            return (
              <div className={cn("rounded-xl p-4 mb-4 border", color.bg, color.border, color.text)}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={cn("h-1.5 w-1.5 rounded-full", color.dot)} />
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">
                    {selectedEvent.kind}
                  </span>
                </div>
                <h3 className="font-bold text-base mb-1 leading-snug">{selectedEvent.title}</h3>
                <p className="text-xs opacity-75">
                  {selectedEvent.start.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="text-xs opacity-75 font-semibold mt-0.5">
                  {selectedEvent.start.toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                  {" - "}
                  {selectedEvent.end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                </p>

                {selectedEvent.location && (
                  <div className="flex items-center gap-1.5 text-xs mt-3 opacity-90">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate">{selectedEvent.location}</span>
                  </div>
                )}
              </div>
            );
          })()}

          {selectedEvent.aiNote && (
            <div className="mb-4 rounded-xl border border-border bg-surface/50 p-3">
              <p className="text-[10px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                AI Assistant Summary
              </p>
              <p className="text-[12.5px] leading-relaxed text-foreground">
                {selectedEvent.aiNote}
              </p>
            </div>
          )}

          {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
            <div className="mb-5">
              <p className="text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                Attendees
              </p>
              <div className="space-y-2">
                {selectedEvent.attendees.map((attendee) => (
                  <div
                    key={attendee.name}
                    className="flex items-center gap-2 rounded-lg border border-border/40 bg-surface/20 px-2.5 py-1.5"
                  >
                    <div className="grid h-6 w-6 place-items-center rounded-full text-[10px] font-semibold text-foreground bg-muted border border-border/60">
                      {attendee.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate text-foreground">
                        {attendee.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => onDeleteEvent(selectedEvent.id)}
              className="flex-1 h-8.5 rounded-lg border border-border bg-surface/60 text-xs font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all active:scale-95 cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 flex flex-col items-center justify-center h-full min-h-[200px]">
          <Sparkles className="h-7 w-7 text-muted-foreground/30 mb-2.5 animate-pulse" />
          <p className="text-xs text-muted-foreground font-medium">
            Select an event or click a slot to add
          </p>
        </div>
      )}
    </div>
  );
}
