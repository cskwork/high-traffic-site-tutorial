import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AudioState {
  enabled: boolean;
  started: boolean;
  volume: number;
}

export type Lang = "en" | "ko";

interface AppState {
  audio: AudioState;
  lang: Lang;
  completed: ReadonlyArray<string>;
  inspectorOpen: boolean;
  navOpen: boolean;
  setAudio: (next: Partial<AudioState>) => void;
  setLang: (lang: Lang) => void;
  markComplete: (slug: string) => void;
  toggleInspector: () => void;
  toggleNav: () => void;
  reset: () => void;
}

function detectInitialLang(): Lang {
  if (typeof navigator === "undefined") return "en";
  return navigator.language?.toLowerCase().startsWith("ko") ? "ko" : "en";
}

const initialState = {
  audio: { enabled: false, started: false, volume: 0.6 } satisfies AudioState,
  lang: detectInitialLang() as Lang,
  completed: [] as ReadonlyArray<string>,
  inspectorOpen: true,
  navOpen: true,
};

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,
      setAudio: (next) => set((s) => ({ audio: { ...s.audio, ...next } })),
      setLang: (lang) => set({ lang }),
      markComplete: (slug) =>
        set((s) =>
          s.completed.includes(slug)
            ? s
            : { completed: [...s.completed, slug] },
        ),
      toggleInspector: () => set((s) => ({ inspectorOpen: !s.inspectorOpen })),
      toggleNav: () => set((s) => ({ navOpen: !s.navOpen })),
      reset: () => set({ ...initialState }),
    }),
    {
      name: "htst.v1",
      partialize: (s) => ({
        audio: { enabled: s.audio.enabled, volume: s.audio.volume, started: false },
        lang: s.lang,
        completed: s.completed,
        inspectorOpen: s.inspectorOpen,
        navOpen: s.navOpen,
      }),
    },
  ),
);
