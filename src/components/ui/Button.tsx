import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cx } from "@/lib/cx";

type Variant = "primary" | "ghost" | "outline" | "concept";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const base =
  "inline-flex items-center justify-center gap-2 font-medium transition will-change-transform " +
  "disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-md";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink-50 text-ink-900 hover:bg-white active:scale-[0.98] shadow-[0_0_0_1px_rgba(255,255,255,0.06)]",
  ghost:
    "bg-transparent text-ink-100 hover:bg-white/5 active:bg-white/10",
  outline:
    "border border-white/10 bg-white/0 text-ink-100 hover:bg-white/5",
  concept:
    "bg-[var(--concept-soft)] text-ink-50 border border-[color:var(--concept)]/40 hover:bg-[color:var(--concept)]/20",
};

const sizes: Record<Size, string> = {
  sm: "h-7 px-2.5 text-xs",
  md: "h-9 px-3 text-sm",
  lg: "h-11 px-4 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={cx(base, variants[variant], sizes[size], className)}
      {...rest}
    />
  );
});
