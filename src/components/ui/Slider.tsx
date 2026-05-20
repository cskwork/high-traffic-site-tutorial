import { useId } from "react";
import type { InputHTMLAttributes } from "react";
import { cx } from "@/lib/cx";

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange: (v: number) => void;
}

export function Slider({
  label,
  value,
  min = 0,
  max = 1,
  step = 0.01,
  onValueChange,
  className,
  id,
  ...rest
}: SliderProps) {
  const reactId = useId();
  const sliderId = id ?? `slider-${reactId}`;
  return (
    <label className={cx("flex flex-col gap-1", className)} htmlFor={sliderId}>
      {label ? (
        <span className="text-[0.65rem] uppercase tracking-[0.18em] text-ink-300">{label}</span>
      ) : null}
      <input
        id={sliderId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onValueChange(parseFloat(e.target.value))}
        className="accent-pattern-300 h-1.5 cursor-pointer appearance-none rounded-full bg-white/10"
        {...rest}
      />
    </label>
  );
}
