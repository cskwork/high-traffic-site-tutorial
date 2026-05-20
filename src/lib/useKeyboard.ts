import { useEffect, useRef } from "react";

type Handler = (e: KeyboardEvent) => void;

export function useKeyboardShortcuts(map: Record<string, Handler>) {
  const mapRef = useRef(map);
  mapRef.current = map;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      const current = mapRef.current;
      const fn = current[e.key.toLowerCase()] ?? current[e.key];
      if (fn) fn(e);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}
