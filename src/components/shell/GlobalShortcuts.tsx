import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { useKeyboardShortcuts } from "@/lib/useKeyboard";
import { useApp } from "@/lib/store";
import { useAudio } from "@/audio/useAudio";
import { neighborSlugs, concepts } from "@/content/registry";

export function GlobalShortcuts() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const toggleNav = useApp((s) => s.toggleNav);
  const toggleInspector = useApp((s) => s.toggleInspector);
  const { audio, enable, disable } = useAudio();

  const goNext = useCallback(() => {
    if (slug) {
      const { next } = neighborSlugs(slug);
      if (next) navigate(`/learn/${next}`);
    } else {
      const first = concepts[0]?.slug;
      if (first) navigate(`/learn/${first}`);
    }
  }, [slug, navigate]);

  const goPrev = useCallback(() => {
    if (!slug) return;
    const { prev } = neighborSlugs(slug);
    if (prev) navigate(`/learn/${prev}`);
  }, [slug, navigate]);

  const goHome = useCallback(() => navigate("/"), [navigate]);

  const shortcuts = useMemo(
    () => ({
      enter: goNext,
      arrowright: goNext,
      arrowleft: goPrev,
      h: goHome,
      n: toggleNav,
      i: toggleInspector,
      m: () => (audio.enabled ? disable() : void enable()),
    }),
    [goNext, goPrev, goHome, toggleNav, toggleInspector, audio.enabled, enable, disable],
  );

  useKeyboardShortcuts(shortcuts);
  return null;
}
