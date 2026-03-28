import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UiStore {
  themeMode: "light" | "dark";
  language: string;
  highContrastEnabled: boolean;
  simpleLanguageMode: boolean;
  toggleTheme: () => void;
  setLanguage: (lang: string) => void;
  toggleHighContrast: () => void;
  toggleSimpleLanguage: () => void;
}

export const useUiStore = create<UiStore>()(
  persist(
    (set) => ({
      themeMode: "light",
      language: "ENGLISH",
      highContrastEnabled: false,
      simpleLanguageMode: false,
      toggleTheme: () =>
        set((s) => {
          const next = s.themeMode === "light" ? "dark" : "light";
          document.documentElement.classList.toggle("dark", next === "dark");
          return { themeMode: next };
        }),
      setLanguage: (lang) => set({ language: lang }),
      toggleHighContrast: () => set((s) => ({ highContrastEnabled: !s.highContrastEnabled })),
      toggleSimpleLanguage: () => set((s) => ({ simpleLanguageMode: !s.simpleLanguageMode })),
    }),
    { name: "harvester-ui" }
  )
);
