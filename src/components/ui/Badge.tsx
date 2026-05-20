import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

interface BadgeProps {
  children: ReactNode;
  tone?: "neutral" | "concept" | "ok" | "warn";
  className?: string;
}

const tones = {
  neutral: "bg-white/5 text-ink-100 border-white/10",
  concept: "bg-[var(--concept-soft)] text-ink-50 border-[color:var(--concept)]/40",
  ok: "bg-emerald-500/10 text-emerald-200 border-emerald-400/30",
  warn: "bg-amber-500/10 text-amber-200 border-amber-400/30",
};

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[0.68rem] font-medium uppercase tracking-wider",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
