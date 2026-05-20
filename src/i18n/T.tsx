/* eslint-disable react-refresh/only-export-components -- co-locate the T component with re-exports of its sibling Bilingual type and useT hook so the public i18n surface is one import path. */
import { useApp } from "@/lib/store";
import type { Bilingual } from "@/i18n/useT";

/** Render bilingual text as JSX children. */
export function T({ en, ko }: Bilingual) {
  const lang = useApp((s) => s.lang);
  return <>{lang === "ko" ? ko : en}</>;
}

export type { Bilingual } from "@/i18n/useT";
export { useT } from "@/i18n/useT";
