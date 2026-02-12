"use client";

import { ChartDonut } from "@phosphor-icons/react";

interface DistributionSegment {
  label: string;
  value: number;
  color: string;
}

interface TimeDistributionProps {
  segments: DistributionSegment[];
  totalLabel?: string;
}

export function TimeDistribution({ segments, totalLabel = "Total" }: TimeDistributionProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  if (total === 0) {
    return (
      <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
        <div className="flex items-center gap-2">
          <ChartDonut size={18} weight="duotone" className="text-[var(--text-tertiary)]" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Time Distribution</h3>
        </div>
        <p className="mt-4 text-center text-sm text-[var(--text-tertiary)]">No data yet</p>
      </div>
    );
  }

  // Build SVG donut
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  let cumulativeOffset = 0;

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
      <div className="mb-4 flex items-center gap-2">
        <ChartDonut size={18} weight="duotone" className="text-[var(--text-tertiary)]" />
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Time Distribution</h3>
      </div>

      <div className="flex items-center gap-6">
        {/* Donut */}
        <div className="relative h-28 w-28 shrink-0">
          <svg viewBox="0 0 120 120" className="h-28 w-28 -rotate-90">
            {segments.map((seg, i) => {
              const pct = seg.value / total;
              const dashLength = pct * circumference;
              const dashOffset = -(cumulativeOffset / total) * circumference;
              cumulativeOffset += seg.value;
              return (
                <circle
                  key={i}
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="12"
                  strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                  strokeDashoffset={dashOffset}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm font-bold text-[var(--text-primary)]">{total}h</span>
            <span className="text-[9px] text-[var(--text-tertiary)]">{totalLabel}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {segments.map((seg) => {
            const pct = Math.round((seg.value / total) * 100);
            return (
              <div key={seg.label} className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: seg.color }} />
                <span className="flex-1 text-xs text-[var(--text-primary)]">{seg.label}</span>
                <span className="text-xs font-medium text-[var(--text-secondary)]">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
