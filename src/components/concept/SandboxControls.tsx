import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider";
import { cx } from "@/lib/cx";

interface SandboxControlsProps {
  children: ReactNode;
  className?: string;
}

export function SandboxControls({ children, className }: SandboxControlsProps) {
  return (
    <div className={cx("flex flex-wrap items-end gap-3", className)}>{children}</div>
  );
}

interface ToggleProps {
  label: string;
  value: boolean;
  onToggle: () => void;
}

export function Toggle({ label, value, onToggle }: ToggleProps) {
  return (
    <Button
      variant={value ? "concept" : "outline"}
      size="sm"
      onClick={onToggle}
      aria-pressed={value}
    >
      {value ? "■ Pause" : "▶ Play"} {label}
    </Button>
  );
}

interface ActionButtonProps {
  label: string;
  onAction: () => void;
  primary?: boolean;
}

export function ActionButton({ label, onAction, primary }: ActionButtonProps) {
  return (
    <Button variant={primary ? "concept" : "outline"} size="sm" onClick={onAction}>
      {label}
    </Button>
  );
}

interface CounterDisplayProps {
  label: string;
  value: number;
  hint?: string;
}

export function CounterDisplay({ label, value, hint }: CounterDisplayProps) {
  return (
    <div className="flex flex-col gap-0.5 rounded-md border border-white/5 bg-white/[0.02] px-3 py-1.5">
      <span className="text-[0.62rem] uppercase tracking-[0.18em] text-ink-300">{label}</span>
      <span className="font-mono text-base text-ink-50">{value}</span>
      {hint ? <span className="text-[0.7rem] text-ink-300">{hint}</span> : null}
    </div>
  );
}

export { Slider as SandboxSlider };
