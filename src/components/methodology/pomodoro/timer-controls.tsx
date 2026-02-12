"use client";

import { Play, Pause, Stop, ArrowClockwise } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import type { TimerState } from "@/types/timer";

interface TimerControlsProps {
  status: TimerState["status"];
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onReset: () => void;
  disabled?: boolean;
}

export function TimerControls({
  status,
  onStart,
  onPause,
  onResume,
  onStop,
  onReset,
  disabled = false,
}: TimerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      {status === "idle" && (
        <Button
          size="lg"
          onClick={onStart}
          disabled={disabled}
          className="min-w-[140px] gap-2 bg-[var(--color-pomodoro)] hover:bg-[var(--color-pomodoro)]/90"
        >
          <Play size={20} weight="fill" />
          Start Focus
        </Button>
      )}

      {status === "running" && (
        <>
          <Button
            variant="outline"
            size="lg"
            onClick={onPause}
            className="gap-2"
          >
            <Pause size={20} weight="fill" />
            Pause
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onStop}
            className="text-[var(--text-tertiary)] hover:text-[var(--color-error)]"
            aria-label="Stop timer"
          >
            <Stop size={20} weight="fill" />
          </Button>
        </>
      )}

      {status === "paused" && (
        <>
          <Button
            size="lg"
            onClick={onResume}
            className="min-w-[140px] gap-2 bg-[var(--color-pomodoro)] hover:bg-[var(--color-pomodoro)]/90"
          >
            <Play size={20} weight="fill" />
            Resume
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onStop}
            className="text-[var(--text-tertiary)] hover:text-[var(--color-error)]"
            aria-label="Stop timer"
          >
            <Stop size={20} weight="fill" />
          </Button>
        </>
      )}

      {status === "completed" && (
        <Button
          size="lg"
          onClick={onReset}
          className="min-w-[140px] gap-2"
        >
          <ArrowClockwise size={20} />
          Next Session
        </Button>
      )}
    </div>
  );
}
