"use client";

import { useState, useEffect, useCallback } from "react";
import { Timer, Play, Pause, Stop, SquaresFour } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface BatchTimerProps {
  categoryName: string;
  categoryColor: string;
  durationMinutes?: number;
  onComplete?: () => void;
}

export function BatchTimer({
  categoryName,
  categoryColor,
  durationMinutes = 30,
  onComplete,
}: BatchTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, onComplete]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setSecondsLeft(durationMinutes * 60);
  }, [durationMinutes]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress = ((durationMinutes * 60 - secondsLeft) / (durationMinutes * 60)) * 100;

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
      <div className="mb-4 flex items-center gap-2">
        <SquaresFour size={18} weight="duotone" style={{ color: categoryColor }} />
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Batch: {categoryName}</h3>
      </div>

      <div className="mb-4 flex flex-col items-center gap-4">
        <span className="font-mono text-4xl font-bold text-[var(--text-primary)]">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>

        <div className="h-2 w-full rounded-full bg-[var(--surface-secondary)]">
          <div
            className="h-2 rounded-full transition-all"
            style={{ width: `${progress}%`, backgroundColor: categoryColor }}
          />
        </div>
      </div>

      <div className="flex justify-center gap-3">
        {!isRunning ? (
          <Button size="sm" onClick={() => setIsRunning(true)} disabled={secondsLeft === 0}>
            <Play size={14} weight="fill" className="mr-1.5" />
            {secondsLeft === durationMinutes * 60 ? "Start" : "Resume"}
          </Button>
        ) : (
          <Button size="sm" variant="outline" onClick={() => setIsRunning(false)}>
            <Pause size={14} weight="fill" className="mr-1.5" />
            Pause
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={reset}>
          <Stop size={14} weight="fill" className="mr-1.5" />
          Reset
        </Button>
      </div>
    </div>
  );
}
