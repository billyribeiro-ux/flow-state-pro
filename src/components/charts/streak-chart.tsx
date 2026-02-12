"use client";

import { Fire } from "@phosphor-icons/react";

interface StreakDay {
  date: string;
  completed: boolean;
}

interface StreakChartProps {
  days: StreakDay[];
  currentStreak: number;
  longestStreak: number;
}

export function StreakChart({ days, currentStreak, longestStreak }: StreakChartProps) {
  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Fire size={18} weight="duotone" className="text-[var(--color-warning)]" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Streak</h3>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-lg font-bold text-[var(--color-warning)]">{currentStreak}</p>
            <p className="text-[10px] text-[var(--text-tertiary)]">Current</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-[var(--text-primary)]">{longestStreak}</p>
            <p className="text-[10px] text-[var(--text-tertiary)]">Best</p>
          </div>
        </div>
      </div>

      <div className="flex gap-1">
        {days.map((day, i) => (
          <div
            key={i}
            className={`h-8 flex-1 rounded-[3px] transition-colors ${
              day.completed
                ? "bg-[var(--color-warning)]"
                : "bg-[var(--surface-secondary)]"
            }`}
            title={`${day.date}: ${day.completed ? "Completed" : "Missed"}`}
          />
        ))}
      </div>

      {days.length > 0 && (
        <div className="mt-2 flex justify-between">
          <span className="text-[9px] text-[var(--text-tertiary)]">{days[0]?.date}</span>
          <span className="text-[9px] text-[var(--text-tertiary)]">{days[days.length - 1]?.date}</span>
        </div>
      )}
    </div>
  );
}
