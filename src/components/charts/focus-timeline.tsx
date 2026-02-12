"use client";

import { Clock } from "@phosphor-icons/react";

interface TimelineEntry {
  hour: number; // 0-23
  focusMinutes: number;
}

interface FocusTimelineProps {
  data: TimelineEntry[];
  maxMinutes?: number;
}

export function FocusTimeline({ data, maxMinutes = 60 }: FocusTimelineProps) {
  const hours = Array.from({ length: 24 }, (_, i) => {
    const entry = data.find((d) => d.hour === i);
    return { hour: i, minutes: entry?.focusMinutes ?? 0 };
  });

  const peak = Math.max(...hours.map((h) => h.minutes), 1);

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
      <div className="mb-4 flex items-center gap-2">
        <Clock size={18} weight="duotone" className="text-[var(--text-tertiary)]" />
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Focus Timeline</h3>
      </div>

      <div className="flex h-32 items-end gap-[3px]">
        {hours.map((h) => {
          const height = (h.minutes / peak) * 100;
          const isActive = h.minutes > 0;
          return (
            <div
              key={h.hour}
              className="group relative flex-1"
              title={`${h.hour}:00 — ${h.minutes}m`}
            >
              <div
                className="w-full rounded-t-[2px] transition-all"
                style={{
                  height: `${Math.max(height, 2)}%`,
                  backgroundColor: isActive
                    ? "var(--color-brand-600)"
                    : "var(--surface-secondary)",
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex justify-between">
        <span className="text-[9px] text-[var(--text-tertiary)]">12am</span>
        <span className="text-[9px] text-[var(--text-tertiary)]">6am</span>
        <span className="text-[9px] text-[var(--text-tertiary)]">12pm</span>
        <span className="text-[9px] text-[var(--text-tertiary)]">6pm</span>
        <span className="text-[9px] text-[var(--text-tertiary)]">12am</span>
      </div>
    </div>
  );
}
