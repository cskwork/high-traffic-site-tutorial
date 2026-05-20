import { useCallback } from "react";
import { useApp } from "@/lib/store";

export interface Bilingual {
  readonly en: string;
  readonly ko: string;
}

/** Hook for use in attribute strings (aria-label, title, etc.) or in array data. */
export function useT(): (b: Bilingual) => string {
  const lang = useApp((s) => s.lang);
  return useCallback((b: Bilingual) => (lang === "ko" ? b.ko : b.en), [lang]);
}

/** Resolve a Bilingual outside of React's render. Reads current store. */
export function txNow(b: Bilingual): string {
  return useApp.getState().lang === "ko" ? b.ko : b.en;
}
