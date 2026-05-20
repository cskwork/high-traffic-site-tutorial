import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

interface StageProps {
  children: ReactNode;
  label?: string;
  className?: string;
  height?: number | string;
}

export function Stage({ children, label, className, height = 360 }: StageProps) {
  return (
    <figure
      className={cx(
        "surface relative overflow-hidden rounded-xl",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-xl",
        "before:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]",
        className,
      )}
      style={{ height }}
      role="img"
      aria-label={label ?? "Interactive visualization"}
    >
      <div className="absolute inset-0">{children}</div>
      {label ? (
        <figcaption className="absolute bottom-2 left-3 z-10 text-[0.65rem] uppercase tracking-[0.18em] text-ink-300">
          {label}
        </figcaption>
      ) : null}
    </figure>
  );
}
