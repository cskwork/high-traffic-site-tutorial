import { useCallback, useEffect } from "react";
import { audio } from "@/audio/engine";
import { useApp } from "@/lib/store";
import type { Motif } from "@/lib/types";

export function useAudio() {
  const audioState = useApp((s) => s.audio);
  const setAudio = useApp((s) => s.setAudio);

  useEffect(() => {
    if (!audioState.started) return;
    audio.setVolume(audioState.volume);
    audio.setEnabled(audioState.enabled);
  }, [audioState.started, audioState.volume, audioState.enabled]);

  const ensureStarted = useCallback(async () => {
    if (!audio.isStarted()) {
      await audio.start();
    }
    if (!audioState.started) {
      setAudio({ started: true, enabled: true });
    }
  }, [audioState.started, setAudio]);

  const play = useCallback(
    async (motif: Motif) => {
      if (!audioState.enabled && !audioState.started) {
        return;
      }
      await ensureStarted();
      audio.trigger(motif);
    },
    [audioState.enabled, audioState.started, ensureStarted],
  );

  const ping = useCallback(
    async (voice?: Motif["voice"], note?: string) => {
      if (!audioState.enabled && !audioState.started) return;
      await ensureStarted();
      audio.ping(voice, note);
    },
    [audioState.enabled, audioState.started, ensureStarted],
  );

  const enable = useCallback(async () => {
    await ensureStarted();
    setAudio({ enabled: true });
  }, [ensureStarted, setAudio]);

  const disable = useCallback(() => {
    setAudio({ enabled: false });
  }, [setAudio]);

  const setVolume = useCallback(
    (v: number) => {
      setAudio({ volume: v });
    },
    [setAudio],
  );

  return { audio: audioState, play, ping, enable, disable, setVolume };
}
