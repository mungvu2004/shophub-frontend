import { create } from "zustand";

export type Theme = "light" | "dark";
export type SelectedPlatform = "all" | "lazada" | "shopee" | "tiktok_shop";

function getTodayDateString() {
  return new Date().toISOString().slice(0, 10);
}

type UIState = {
  sidebarOpen: boolean;
  theme: Theme;
  selectedPlatform: SelectedPlatform;
  selectedDate: string;
  toggleSidebar: () => void;
  setTheme: (theme: Theme) => void;
  setSelectedPlatform: (platform: SelectedPlatform) => void;
  setSelectedDate: (date: string) => void;
};

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  theme: "light",
  selectedPlatform: "all",
  selectedDate: getTodayDateString(),
  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),
  setTheme: (theme) =>
    set({
      theme,
    }),
  setSelectedPlatform: (platform) =>
    set({
      selectedPlatform: platform,
    }),
  setSelectedDate: (date) =>
    set({
      selectedDate: date || getTodayDateString(),
    }),
}));
