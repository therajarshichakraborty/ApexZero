import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { emails as initialEmails, type Email } from "./mock-data";

export type Folder =
  | "inbox"
  | "important"
  | "starred"
  | "sent"
  | "drafts"
  | "archive"
  | "spam"
  | "trash";

interface AppState {
  emails: Email[];
  selectedId: string | null;
  folder: Folder;
  search: string;
  composeOpen: boolean;
  paletteOpen: boolean;
  assistantOpen: boolean;

  select: (id: string | null) => void;
  setFolder: (f: Folder) => void;
  setSearch: (s: string) => void;
  toggleStar: (id: string) => void;
  markRead: (id: string) => void;
  archive: (id: string) => void;
  remove: (id: string) => void;
  openCompose: () => void;
  closeCompose: () => void;
  openPalette: () => void;
  closePalette: () => void;
  togglePalette: () => void;
  toggleAssistant: () => void;
}

export const useApp = create<AppState>((set, get) => ({
  emails: initialEmails,
  selectedId: initialEmails[0]?.id ?? null,
  folder: "inbox",
  search: "",
  composeOpen: false,
  paletteOpen: false,
  assistantOpen: true,

  select: (id) => {
    set({ selectedId: id });
    if (id) get().markRead(id);
  },
  setFolder: (f) => set({ folder: f, selectedId: null }),
  setSearch: (s) => set({ search: s }),
  toggleStar: (id) =>
    set((s) => ({
      emails: s.emails.map((e) => (e.id === id ? { ...e, starred: !e.starred } : e)),
    })),
  markRead: (id) =>
    set((s) => ({
      emails: s.emails.map((e) => (e.id === id ? { ...e, unread: false } : e)),
    })),
  archive: (id) =>
    set((s) => ({
      emails: s.emails.map((e) => (e.id === id ? { ...e, folder: "archive" } : e)),
      selectedId: s.selectedId === id ? null : s.selectedId,
    })),
  remove: (id) =>
    set((s) => ({
      emails: s.emails.map((e) => (e.id === id ? { ...e, folder: "trash" } : e)),
      selectedId: s.selectedId === id ? null : s.selectedId,
    })),
  openCompose: () => set({ composeOpen: true }),
  closeCompose: () => set({ composeOpen: false }),
  openPalette: () => set({ paletteOpen: true }),
  closePalette: () => set({ paletteOpen: false }),
  togglePalette: () => set((s) => ({ paletteOpen: !s.paletteOpen })),
  toggleAssistant: () => set((s) => ({ assistantOpen: !s.assistantOpen })),
}));

export function useVisibleEmails() {
  return useApp(
    useShallow((s) => {
      const q = s.search.trim().toLowerCase();
      return s.emails.filter((e) => {
        if (s.folder === "starred") {
          if (!e.starred || e.folder === "trash" || e.folder === "spam") return false;
        } else if (s.folder === "important") {
          if (e.aiPriority < 70 || e.folder === "trash" || e.folder === "spam") return false;
        } else if (e.folder !== s.folder) return false;

        if (q) {
          const hay = `${e.senderName} ${e.subject} ${e.preview}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });
    }),
  );
}
