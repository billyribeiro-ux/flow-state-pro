"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils/cn";
import { formatTimerDisplay } from "@/lib/utils/timer";

interface TimerDisplayProps {
  elapsedSeconds: number;
  durationSeconds: number;
  status: "idle" | "running" | "paused" | "completed";
  color?: string;
}

export function TimerDisplay({
  elapsedSeconds,
  durationSeconds,
  status,
  color = "var(--color-pomodoro)",
}: TimerDisplayProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const remaining = Math.max(0, durationSeconds - elapsedSeconds);
  const { minutes, seconds } = formatTimerDisplay(remaining);
  const progress = durationSeconds > 0 ? elapsedSeconds / durationSeconds : 0;

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  // Animate the ring on status change
  useEffect(() => {
    if (!circleRef.current) return;
    if (status === "running") {
      gsap.to(circleRef.current, {
        strokeDashoffset,
        duration: 1,
        ease: "linear",
      });
    } else {
      gsap.set(circleRef.current, { strokeDashoffset });
    }
  }, [strokeDashoffset, status]);

  return (
    <div className="relative flex items-center justify-center">
      {/* SVG Ring */}
      <svg
        width="280"
        height="280"
        viewBox="0 0 280 280"
        className="rotate-[-90deg]"
        aria-hidden="true"
      >
        {/* Background ring */}
        <circle
          cx="140"
          cy="140"
          r={radius}
          fill="none"
          stroke="var(--border-subtle)"
          strokeWidth="8"
        />
        {/* Progress ring */}
        <circle
          ref={circleRef}
          cx="140"
          cy="140"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-opacity"
          style={{ opacity: status === "idle" ? 0.3 : 1 }}
        />
      </svg>

      {/* Time display */}
      <div className="absolute flex flex-col items-center">
        <div
          className={cn(
            "font-[family-name:var(--font-jetbrains)] text-5xl font-bold tracking-tight sm:text-6xl",
            status === "paused" && "animate-pulse"
          )}
          style={{ color: status === "completed" ? "var(--color-success)" : color }}
          role="timer"
          aria-live="polite"
          aria-label={`${minutes} minutes ${seconds} seconds remaining`}
        >
          {minutes}:{seconds}
        </div>
        <p className="mt-1 text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
          {status === "idle" && "Ready"}
          {status === "running" && "Focus"}
          {status === "paused" && "Paused"}
          {status === "completed" && "Complete!"}
        </p>
      </div>
    </div>
  );
}
