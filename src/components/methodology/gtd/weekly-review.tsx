"use client";

import { useState } from "react";
import { CheckCircle, Circle, CalendarCheck } from "@phosphor-icons/react";

const REVIEW_STEPS = [
  "Collect all loose papers and materials",
  "Process inbox to zero",
  "Review action lists",
  "Review waiting-for list",
  "Review project list",
  "Review someday/maybe list",
  "Review calendar (past two weeks)",
  "Review calendar (upcoming)",
  "Review goals and vision",
  "Be creative — capture new ideas",
];

export function WeeklyReview() {
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const toggleStep = (index: number) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const progress = Math.round((completed.size / REVIEW_STEPS.length) * 100);

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarCheck size={18} weight="duotone" className="text-[var(--methodology-gtd)]" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Weekly Review</h3>
        </div>
        <span className="text-xs font-medium text-[var(--text-tertiary)]">{progress}%</span>
      </div>

      <div className="mb-4 h-1.5 w-full rounded-full bg-[var(--surface-secondary)]">
        <div
          className="h-1.5 rounded-full bg-[var(--methodology-gtd)] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ul className="space-y-2">
        {REVIEW_STEPS.map((step, i) => {
          const done = completed.has(i);
          return (
            <li key={i}>
              <button
                onClick={() => toggleStep(i)}
                className="flex w-full items-center gap-3 rounded-[var(--radius-md)] p-2 text-left transition-colors hover:bg-[var(--surface-secondary)]"
              >
                {done ? (
                  <CheckCircle size={18} weight="fill" className="shrink-0 text-[var(--color-success)]" />
                ) : (
                  <Circle size={18} className="shrink-0 text-[var(--text-tertiary)]" />
                )}
                <span className={`text-sm ${done ? "text-[var(--text-tertiary)] line-through" : "text-[var(--text-primary)]"}`}>
                  {step}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
