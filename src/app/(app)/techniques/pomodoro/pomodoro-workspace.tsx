"use client";

import { useCallback } from "react";
import { TimerDisplay } from "@/components/methodology/pomodoro/timer-display";
import { TimerControls } from "@/components/methodology/pomodoro/timer-controls";
import { StatsCard } from "@/components/methodology/pomodoro/stats-card";
import { useTimerStore } from "@/lib/stores/timer-store";
import { minutesToSeconds } from "@/lib/utils/timer";

export function PomodoroWorkspace() {
  const {
    status,
    elapsedSeconds,
    durationSeconds,
    pomodoroCycle,
    pomodoroSet,
    settings,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
  } = useTimerStore();

  const handleStart = useCallback(() => {
    startTimer({
      sessionId: crypto.randomUUID(),
      methodology: "pomodoro",
      type: "focus",
      durationSeconds: minutesToSeconds(settings.focusDuration),
      pomodoroCycle,
      pomodoroSet,
    });
  }, [startTimer, settings.focusDuration, pomodoroCycle, pomodoroSet]);

  const handleStop = useCallback(() => {
    stopTimer();
  }, [stopTimer]);

  const handleReset = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
          Pomodoro Timer
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          25 minutes of pure focus. No distractions.
        </p>
      </div>

      {/* Timer + Stats layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Timer */}
        <div className="flex flex-col items-center gap-8 rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-8 shadow-[var(--shadow-xs)] sm:p-12">
          <TimerDisplay
            elapsedSeconds={elapsedSeconds}
            durationSeconds={durationSeconds || minutesToSeconds(settings.focusDuration)}
            status={status}
            color="var(--color-pomodoro)"
          />

          <TimerControls
            status={status}
            onStart={handleStart}
            onPause={pauseTimer}
            onResume={resumeTimer}
            onStop={handleStop}
            onReset={handleReset}
          />

          {/* Quick settings */}
          <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
            <span>Focus: {settings.focusDuration}m</span>
            <span className="text-[var(--border-default)]">•</span>
            <span>Break: {settings.breakDuration}m</span>
            <span className="text-[var(--border-default)]">•</span>
            <span>Long: {settings.longBreakDuration}m</span>
          </div>
        </div>

        {/* Sidebar stats */}
        <div className="space-y-4">
          <StatsCard
            pomodoroCycle={pomodoroCycle}
            pomodoroSet={pomodoroSet}
            cyclesBeforeLongBreak={settings.cyclesBeforeLongBreak}
            todaySessions={0}
            todayFocusMinutes={0}
          />

          {/* Task assignment placeholder */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-4 shadow-[var(--shadow-xs)]">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              Current Task
            </h3>
            <p className="mt-2 text-xs text-[var(--text-tertiary)]">
              No task assigned. Add a task to track what you&apos;re working on.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
