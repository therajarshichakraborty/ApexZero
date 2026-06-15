import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

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
  selectedId: string | null;
  folder: Folder;
  search: string;
  composeOpen: boolean;
  paletteOpen: boolean;
  assistantOpen: boolean;
  sidebarOpen: boolean;

  select: (id: string | null) => void;
  setFolder: (f: Folder) => void;
  setSearch: (s: string) => void;
  openCompose: () => void;
  closeCompose: () => void;
  openPalette: () => void;
  closePalette: () => void;
  togglePalette: () => void;
  toggleAssistant: () => void;
  toggleSidebar: () => void;
}

export const useApp = create<AppState>((set) => ({
  selectedId: null,
  folder: "inbox",
  search: "",
  composeOpen: false,
  paletteOpen: false,
  assistantOpen: true,
  sidebarOpen: true,

  select: (id) => set({ selectedId: id }),
  setFolder: (f) => set({ folder: f, selectedId: null }),
  setSearch: (s) => set({ search: s }),
  openCompose: () => set({ composeOpen: true }),
  closeCompose: () => set({ composeOpen: false }),
  openPalette: () => set({ paletteOpen: true }),
  closePalette: () => set({ paletteOpen: false }),
  togglePalette: () => set((s) => ({ paletteOpen: !s.paletteOpen })),
  toggleAssistant: () => set((s) => ({ assistantOpen: !s.assistantOpen })),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
