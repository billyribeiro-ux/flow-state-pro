"use client";

import { useState } from "react";
import { Brain, Play, Pause, Stop, Clock } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useTimerStore } from "@/lib/stores/timer-store";

const DEEP_WORK_PRESETS = [
  { label: "60 min", seconds: 3600 },
  { label: "90 min", seconds: 5400 },
  { label: "120 min", seconds: 7200 },
  { label: "180 min", seconds: 10800 },
];

export function DeepWorkWorkspace() {
  const timer = useTimerStore();
  const [selectedPreset, setSelectedPreset] = useState(5400);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const remaining = Math.max(0, (timer.duration ?? selectedPreset) - timer.elapsed);
  const isActive = timer.status === "running" || timer.status === "paused";

  const handleStart = () => {
    timer.start(null, "deep-work", "deep_work", selectedPreset);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Deep Work</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Extended distraction-free focus sessions for cognitively demanding tasks.
        </p>
      </div>

      {/* Timer Display */}
      <div className="flex flex-col items-center gap-6 rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-8">
        <Brain size={48} weight="duotone" className="text-[var(--methodology-deep-work)]" />

        <div className="text-center">
          <p className="font-mono text-6xl font-bold text-[var(--text-primary)]">
            {isActive ? formatTime(remaining) : formatTime(selectedPreset)}
          </p>
          <p className="mt-2 text-sm text-[var(--text-tertiary)]">
            {isActive ? "Deep focus in progress..." : "Select your session length"}
          </p>
        </div>

        {/* Presets */}
        {!isActive && (
          <div className="flex gap-3">
            {DEEP_WORK_PRESETS.map((preset) => (
              <button
                key={preset.seconds}
                onClick={() => setSelectedPreset(preset.seconds)}
                className={`rounded-[var(--radius-md)] px-4 py-2 text-sm font-medium transition-colors ${
                  selectedPreset === preset.seconds
                    ? "bg-[var(--methodology-deep-work)] text-white"
                    : "bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-3">
          {!isActive && (
            <Button onClick={handleStart} size="lg">
              <Play size={18} weight="fill" className="mr-2" />
              Start Deep Work
            </Button>
          )}
          {timer.status === "running" && (
            <>
              <Button variant="outline" onClick={() => timer.pause()}>
                <Pause size={18} weight="fill" className="mr-2" />
                Pause
              </Button>
              <Button variant="destructive" onClick={() => timer.stop()}>
                <Stop size={18} weight="fill" className="mr-2" />
                End Session
              </Button>
            </>
          )}
          {timer.status === "paused" && (
            <>
              <Button onClick={() => timer.resume()}>
                <Play size={18} weight="fill" className="mr-2" />
                Resume
              </Button>
              <Button variant="destructive" onClick={() => timer.stop()}>
                <Stop size={18} weight="fill" className="mr-2" />
                End Session
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Deep Work Protocol</h3>
        <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-[var(--methodology-deep-work)]">1.</span>
            Close all unnecessary tabs, apps, and notifications
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-[var(--methodology-deep-work)]">2.</span>
            Set a clear intention for what you'll accomplish
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-[var(--methodology-deep-work)]">3.</span>
            Work on a single cognitively demanding task
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-[var(--methodology-deep-work)]">4.</span>
            If distracted, note it and return immediately to focus
          </li>
        </ul>
      </div>
    </div>
  );
}
