import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  color?: string;
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, color, ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn(
          "h-2 w-full overflow-hidden rounded-full bg-[var(--surface-tertiary)]",
          className
        )}
        {...props}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: color ?? "var(--color-brand-600)",
          }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
