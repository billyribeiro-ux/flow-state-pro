"use client";

import { CalendarBlank } from "@phosphor-icons/react";

interface HeatmapDay {
  date: string;
  value: number; // 0-4 intensity
}

interface ProductivityHeatmapProps {
  data: HeatmapDay[];
  weeks?: number;
}

const INTENSITY_COLORS = [
  "var(--surface-secondary)",
  "var(--color-brand-200)",
  "var(--color-brand-400)",
  "var(--color-brand-600)",
  "var(--color-brand-800)",
];

const DAYS = ["Mon", "", "Wed", "", "Fri", "", ""];

export function ProductivityHeatmap({ data, weeks = 12 }: ProductivityHeatmapProps) {
  const grid: number[][] = [];
  for (let w = 0; w < weeks; w++) {
    const week: number[] = [];
    for (let d = 0; d < 7; d++) {
      const idx = w * 7 + d;
      week.push(data[idx]?.value ?? 0);
    }
    grid.push(week);
  }

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
      <div className="mb-4 flex items-center gap-2">
        <CalendarBlank size={18} weight="duotone" className="text-[var(--text-tertiary)]" />
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Productivity Heatmap</h3>
      </div>

      <div className="flex gap-1">
        <div className="flex flex-col gap-1 pr-2 pt-0">
          {DAYS.map((d, i) => (
            <div key={i} className="flex h-3 items-center">
              <span className="text-[9px] text-[var(--text-tertiary)]">{d}</span>
            </div>
          ))}
        </div>
        {grid.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((val, di) => (
              <div
                key={di}
                className="h-3 w-3 rounded-[2px]"
                style={{ backgroundColor: INTENSITY_COLORS[val] ?? INTENSITY_COLORS[0] }}
                title={data[wi * 7 + di]?.date ?? ""}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        <span className="text-[9px] text-[var(--text-tertiary)]">Less</span>
        {INTENSITY_COLORS.map((color, i) => (
          <div key={i} className="h-2.5 w-2.5 rounded-[2px]" style={{ backgroundColor: color }} />
        ))}
        <span className="text-[9px] text-[var(--text-tertiary)]">More</span>
      </div>
    </div>
  );
}
