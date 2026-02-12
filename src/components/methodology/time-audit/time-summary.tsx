"use client";

import { ChartPie, Clock } from "@phosphor-icons/react";

interface TimeSummaryEntry {
  categoryId: string;
  label: string;
  color: string;
  minutes: number;
}

interface TimeSummaryProps {
  entries: TimeSummaryEntry[];
}

export function TimeSummary({ entries }: TimeSummaryProps) {
  const totalMinutes = entries.reduce((sum, e) => sum + e.minutes, 0);

  if (entries.length === 0 || totalMinutes === 0) {
    return (
      <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
        <div className="flex items-center gap-2">
          <ChartPie size={18} weight="duotone" className="text-[var(--text-tertiary)]" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Time Summary</h3>
        </div>
        <div className="mt-4 flex flex-col items-center gap-2 py-6 text-center">
          <Clock size={32} weight="duotone" className="text-[var(--text-tertiary)]" />
          <p className="text-sm text-[var(--text-secondary)]">Start tracking to see your summary</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ChartPie size={18} weight="duotone" className="text-[var(--text-tertiary)]" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Time Summary</h3>
        </div>
        <span className="text-xs text-[var(--text-tertiary)]">
          {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m total
        </span>
      </div>

      {/* Stacked Bar */}
      <div className="mb-4 flex h-4 w-full overflow-hidden rounded-full">
        {entries.map((entry) => (
          <div
            key={entry.categoryId}
            className="h-full transition-all"
            style={{
              width: `${(entry.minutes / totalMinutes) * 100}%`,
              backgroundColor: entry.color,
            }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {entries.map((entry) => {
          const pct = Math.round((entry.minutes / totalMinutes) * 100);
          const hours = Math.floor(entry.minutes / 60);
          const mins = entry.minutes % 60;
          return (
            <div key={entry.categoryId} className="flex items-center gap-3">
              <div
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="flex-1 text-sm text-[var(--text-primary)]">{entry.label}</span>
              <span className="text-xs font-medium text-[var(--text-secondary)]">{pct}%</span>
              <span className="w-16 text-right text-xs text-[var(--text-tertiary)]">
                {hours > 0 ? `${hours}h ` : ""}{mins}m
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
