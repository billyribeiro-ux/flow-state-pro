"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, Pause, Stop, ArrowCounterClockwise, Timer } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

type TimerMode = "focus" | "short-break" | "long-break";

interface TimerWidgetProps {
  focusMinutes?: number;
  shortBreakMinutes?: number;
  longBreakMinutes?: number;
  onComplete?: (mode: TimerMode) => void;
  onTick?: (secondsLeft: number) => void;
}

export function TimerWidget({
  focusMinutes = 25,
  shortBreakMinutes = 5,
  longBreakMinutes = 15,
  onComplete,
  onTick,
}: TimerWidgetProps) {
  const [mode, setMode] = useState<TimerMode>("focus");
  const durations: Record<TimerMode, number> = {
    focus: focusMinutes * 60,
    "short-break": shortBreakMinutes * 60,
    "long-break": longBreakMinutes * 60,
  };
  const [secondsLeft, setSecondsLeft] = useState(durations[mode]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;
    const id = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;
        onTick?.(next);
        if (next <= 0) {
          setIsRunning(false);
          onComplete?.(mode);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning, secondsLeft, mode, onComplete, onTick]);

  const switchMode = (m: TimerMode) => {
    setMode(m);
    setSecondsLeft(durations[m]);
    setIsRunning(false);
  };

  const reset = () => {
    setSecondsLeft(durations[mode]);
    setIsRunning(false);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress = ((durations[mode] - secondsLeft) / durations[mode]) * 100;

  const modeColors: Record<TimerMode, string> = {
    focus: "var(--color-brand-600)",
    "short-break": "var(--color-success)",
    "long-break": "var(--color-warning)",
  };

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
      {/* Mode tabs */}
      <div className="mb-6 flex justify-center gap-2">
        {(["focus", "short-break", "long-break"] as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              mode === m
                ? "text-white"
                : "bg-[var(--surface-secondary)] text-[var(--text-secondary)]"
            }`}
            style={mode === m ? { backgroundColor: modeColors[m] } : {}}
          >
            {m === "focus" ? "Focus" : m === "short-break" ? "Short Break" : "Long Break"}
          </button>
        ))}
      </div>

      {/* Timer display */}
      <div className="mb-6 flex flex-col items-center gap-4">
        <div className="relative flex h-40 w-40 items-center justify-center">
          <svg className="h-40 w-40 -rotate-90" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="70" fill="none" stroke="var(--surface-secondary)" strokeWidth="6" />
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke={modeColors[mode]}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${(progress / 100) * 439.82} 439.82`}
            />
          </svg>
          <span className="absolute font-mono text-4xl font-bold text-[var(--text-primary)]">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        {!isRunning ? (
          <Button onClick={() => setIsRunning(true)} disabled={secondsLeft === 0}>
            <Play size={16} weight="fill" className="mr-1.5" />
            {secondsLeft === durations[mode] ? "Start" : "Resume"}
          </Button>
        ) : (
          <Button variant="outline" onClick={() => setIsRunning(false)}>
            <Pause size={16} weight="fill" className="mr-1.5" />
            Pause
          </Button>
        )}
        <Button variant="outline" onClick={reset}>
          <ArrowCounterClockwise size={16} className="mr-1.5" />
          Reset
        </Button>
      </div>
    </div>
  );
}
