"use client";

import { ChartLine } from "@phosphor-icons/react";

interface ParetoItem {
  label: string;
  value: number;
}

interface ParetoCurveProps {
  items: ParetoItem[];
}

export function ParetoCurve({ items }: ParetoCurveProps) {
  const sorted = [...items].sort((a, b) => b.value - a.value);
  const total = sorted.reduce((sum, item) => sum + item.value, 0);

  let cumulative = 0;
  const bars = sorted.map((item) => {
    cumulative += item.value;
    return {
      ...item,
      pct: total > 0 ? Math.round((item.value / total) * 100) : 0,
      cumPct: total > 0 ? Math.round((cumulative / total) * 100) : 0,
    };
  });

  const vitalFewCount = bars.filter((b) => b.cumPct <= 80).length || 1;

  if (items.length === 0) {
    return (
      <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
        <div className="flex items-center gap-2">
          <ChartLine size={18} weight="duotone" className="text-[var(--methodology-pareto)]" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Pareto Analysis</h3>
        </div>
        <p className="mt-4 text-center text-sm text-[var(--text-tertiary)]">Add tasks to see analysis</p>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ChartLine size={18} weight="duotone" className="text-[var(--methodology-pareto)]" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Pareto Analysis</h3>
        </div>
        <span className="text-xs text-[var(--text-tertiary)]">
          {vitalFewCount} of {bars.length} items = 80% impact
        </span>
      </div>

      <div className="space-y-2">
        {bars.map((bar, i) => (
          <div key={bar.label} className="flex items-center gap-3">
            <span className="w-24 truncate text-xs text-[var(--text-secondary)]">{bar.label}</span>
            <div className="flex-1">
              <div className="h-4 w-full rounded-full bg-[var(--surface-secondary)]">
                <div
                  className="h-4 rounded-full transition-all"
                  style={{
                    width: `${bar.pct}%`,
                    backgroundColor:
                      i < vitalFewCount ? "var(--methodology-pareto)" : "var(--surface-tertiary)",
                  }}
                />
              </div>
            </div>
            <span className="w-10 text-right text-xs font-medium text-[var(--text-primary)]">
              {bar.pct}%
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 border-t border-[var(--border-subtle)] pt-3">
        <p className="text-xs text-[var(--text-tertiary)]">
          The top <span className="font-bold text-[var(--methodology-pareto)]">{vitalFewCount}</span> items
          account for ~80% of total impact (80/20 rule).
        </p>
      </div>
    </div>
  );
}
