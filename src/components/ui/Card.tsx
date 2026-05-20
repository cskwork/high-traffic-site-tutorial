import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

interface CardProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "aside";
  padded?: boolean;
}

export function Card({ children, className, as: As = "div", padded = true }: CardProps) {
  return (
    <As className={cx("surface rounded-xl", padded && "p-5", className)}>{children}</As>
  );
}

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionTitle({ eyebrow, title, description, className }: SectionTitleProps) {
  return (
    <div className={cx("flex flex-col gap-1", className)}>
      {eyebrow ? (
        <span className="text-[0.65rem] uppercase tracking-[0.18em] text-ink-300">{eyebrow}</span>
      ) : null}
      <h2 className="font-display text-title text-ink-50">{title}</h2>
      {description ? <p className="max-w-prose text-sm text-ink-200">{description}</p> : null}
    </div>
  );
}
