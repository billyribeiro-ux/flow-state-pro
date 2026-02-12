"use client";

import { useState, useEffect, useRef } from "react";
import { Clock, Play, Stop } from "@phosphor-icons/react";

interface CategoryTrackerProps {
  categoryId: string;
  categoryLabel: string;
  categoryColor: string;
  onEntryComplete?: (entry: { category: string; durationSeconds: number }) => void;
}

export function CategoryTracker({
  categoryId,
  categoryLabel,
  categoryColor,
  onEntryComplete,
}: CategoryTrackerProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isTracking) {
      intervalRef.current = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isTracking]);

  const handleStop = () => {
    setIsTracking(false);
    if (elapsed > 0) {
      onEntryComplete?.({ category: categoryId, durationSeconds: elapsed });
    }
    setElapsed(0);
  };

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return (
    <div
      className={`flex items-center gap-4 rounded-[var(--radius-lg)] border p-4 transition-colors ${
        isTracking
          ? "border-transparent ring-2"
          : "border-[var(--border-subtle)]"
      }`}
      style={isTracking ? { ["--tw-ring-color" as string]: categoryColor } : {}}
    >
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${categoryColor}20` }}
      >
        <Clock size={14} style={{ color: categoryColor }} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[var(--text-primary)]">{categoryLabel}</p>
        {isTracking && (
          <p className="font-mono text-xs" style={{ color: categoryColor }}>
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </p>
        )}
      </div>

      {!isTracking ? (
        <button
          onClick={() => setIsTracking(true)}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[var(--surface-secondary)]"
        >
          <Play size={14} weight="fill" style={{ color: categoryColor }} />
        </button>
      ) : (
        <button
          onClick={handleStop}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-error)]/10 transition-colors hover:bg-[var(--color-error)]/20"
        >
          <Stop size={14} weight="fill" className="text-[var(--color-error)]" />
        </button>
      )}
    </div>
  );
}
