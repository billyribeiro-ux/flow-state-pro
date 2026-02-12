"use client";

import { Crosshair } from "@phosphor-icons/react";

interface ScatterPoint {
  id: string;
  label: string;
  x: number; // 0-100
  y: number; // 0-100
}

interface QuadrantScatterProps {
  points: ScatterPoint[];
  xLabel?: string;
  yLabel?: string;
}

export function QuadrantScatter({
  points,
  xLabel = "Urgency",
  yLabel = "Importance",
}: QuadrantScatterProps) {
  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
      <div className="mb-4 flex items-center gap-2">
        <Crosshair size={18} weight="duotone" className="text-[var(--text-tertiary)]" />
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Priority Matrix</h3>
      </div>

      <div className="relative aspect-square w-full rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-secondary)]">
        {/* Grid lines */}
        <div className="absolute left-1/2 top-0 h-full w-px bg-[var(--border-subtle)]" />
        <div className="absolute left-0 top-1/2 h-px w-full bg-[var(--border-subtle)]" />

        {/* Quadrant labels */}
        <span className="absolute left-2 top-2 text-[9px] font-medium text-[var(--color-error)]">
          Urgent + Important
        </span>
        <span className="absolute right-2 top-2 text-[9px] font-medium text-[var(--color-brand-600)]">
          Not Urgent + Important
        </span>
        <span className="absolute bottom-2 left-2 text-[9px] font-medium text-[var(--color-warning)]">
          Urgent + Not Important
        </span>
        <span className="absolute bottom-2 right-2 text-[9px] font-medium text-[var(--text-tertiary)]">
          Not Urgent + Not Important
        </span>

        {/* Points */}
        {points.map((point) => (
          <div
            key={point.id}
            className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-brand-600)] shadow-sm"
            style={{
              left: `${point.x}%`,
              bottom: `${point.y}%`,
            }}
            title={point.label}
          />
        ))}

        {points.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="text-xs text-[var(--text-tertiary)]">No tasks plotted yet</p>
          </div>
        )}
      </div>

      <div className="mt-2 flex justify-between">
        <span className="text-[9px] text-[var(--text-tertiary)]">{xLabel} →</span>
        <span className="text-[9px] text-[var(--text-tertiary)]">{yLabel} ↑</span>
      </div>
    </div>
  );
}
