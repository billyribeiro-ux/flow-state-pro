"use client";

import { Crosshair } from "@phosphor-icons/react";

interface MatrixItem {
  id: string;
  title: string;
  effort: number; // 1-10
  impact: number; // 1-10
}

interface ImpactMatrixProps {
  items: MatrixItem[];
}

export function ImpactMatrix({ items }: ImpactMatrixProps) {
  const quadrants = {
    quickWins: items.filter((i) => i.effort <= 5 && i.impact > 5),
    majorProjects: items.filter((i) => i.effort > 5 && i.impact > 5),
    fillIns: items.filter((i) => i.effort <= 5 && i.impact <= 5),
    thankless: items.filter((i) => i.effort > 5 && i.impact <= 5),
  };

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
      <div className="mb-4 flex items-center gap-2">
        <Crosshair size={18} weight="duotone" className="text-[var(--methodology-pareto)]" />
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Impact / Effort Matrix</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Quick Wins - High Impact, Low Effort */}
        <div className="rounded-[var(--radius-lg)] border-2 border-[var(--color-success)] bg-[var(--color-success)]/5 p-3">
          <p className="mb-2 text-xs font-bold text-[var(--color-success)]">Quick Wins</p>
          <p className="mb-2 text-[10px] text-[var(--text-tertiary)]">High impact, low effort</p>
          {quadrants.quickWins.length === 0 ? (
            <p className="text-[10px] text-[var(--text-tertiary)]">—</p>
          ) : (
            <ul className="space-y-1">
              {quadrants.quickWins.map((item) => (
                <li key={item.id} className="text-xs text-[var(--text-primary)]">{item.title}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Major Projects - High Impact, High Effort */}
        <div className="rounded-[var(--radius-lg)] border-2 border-[var(--methodology-pareto)] bg-[var(--methodology-pareto)]/5 p-3">
          <p className="mb-2 text-xs font-bold text-[var(--methodology-pareto)]">Major Projects</p>
          <p className="mb-2 text-[10px] text-[var(--text-tertiary)]">High impact, high effort</p>
          {quadrants.majorProjects.length === 0 ? (
            <p className="text-[10px] text-[var(--text-tertiary)]">—</p>
          ) : (
            <ul className="space-y-1">
              {quadrants.majorProjects.map((item) => (
                <li key={item.id} className="text-xs text-[var(--text-primary)]">{item.title}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Fill-Ins - Low Impact, Low Effort */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-secondary)] p-3">
          <p className="mb-2 text-xs font-bold text-[var(--text-secondary)]">Fill-Ins</p>
          <p className="mb-2 text-[10px] text-[var(--text-tertiary)]">Low impact, low effort</p>
          {quadrants.fillIns.length === 0 ? (
            <p className="text-[10px] text-[var(--text-tertiary)]">—</p>
          ) : (
            <ul className="space-y-1">
              {quadrants.fillIns.map((item) => (
                <li key={item.id} className="text-xs text-[var(--text-secondary)]">{item.title}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Thankless - Low Impact, High Effort */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-error)]/30 bg-[var(--color-error)]/5 p-3">
          <p className="mb-2 text-xs font-bold text-[var(--color-error)]">Avoid / Delegate</p>
          <p className="mb-2 text-[10px] text-[var(--text-tertiary)]">Low impact, high effort</p>
          {quadrants.thankless.length === 0 ? (
            <p className="text-[10px] text-[var(--text-tertiary)]">—</p>
          ) : (
            <ul className="space-y-1">
              {quadrants.thankless.map((item) => (
                <li key={item.id} className="text-xs text-[var(--text-tertiary)] line-through">{item.title}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
