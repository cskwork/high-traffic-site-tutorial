import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AudioState {
  enabled: boolean;
  started: boolean;
  volume: number;
}

interface AppState {
  audio: AudioState;
  completed: ReadonlyArray<string>;
  inspectorOpen: boolean;
  navOpen: boolean;
  setAudio: (next: Partial<AudioState>) => void;
  markComplete: (slug: string) => void;
  toggleInspector: () => void;
  toggleNav: () => void;
  reset: () => void;
}

const initialState = {
  audio: { enabled: false, started: false, volume: 0.6 } satisfies AudioState,
  completed: [] as ReadonlyArray<string>,
  inspectorOpen: true,
  navOpen: true,
};

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,
      setAudio: (next) => set((s) => ({ audio: { ...s.audio, ...next } })),
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
        completed: s.completed,
        inspectorOpen: s.inspectorOpen,
        navOpen: s.navOpen,
      }),
    },
  ),
);
