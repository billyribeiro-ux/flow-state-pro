"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number) => void;
  color?: string;
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value = 0, min = 0, max = 100, step = 1, onValueChange, color, ...props }, ref) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onValueChange?.(Number(e.target.value))}
        className={cn(
          "h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--surface-tertiary)] outline-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[var(--shadow-sm)]",
          className
        )}
        style={{
          background: `linear-gradient(to right, ${color ?? "var(--color-brand-600)"} ${percentage}%, var(--surface-tertiary) ${percentage}%)`,
        }}
        {...props}
      />
    );
  }
);
Slider.displayName = "Slider";

export { Slider };
