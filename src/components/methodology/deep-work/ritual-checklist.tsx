"use client";

import { useState } from "react";
import { ListChecks, CheckCircle, Circle } from "@phosphor-icons/react";

const DEFAULT_RITUALS = [
  "Close all unnecessary tabs",
  "Put phone on Do Not Disturb",
  "Fill water bottle",
  "Clear desk of distractions",
  "Set timer for focus session",
  "Open only task-relevant tools",
];

export function RitualChecklist() {
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const toggle = (index: number) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const allDone = completed.size === DEFAULT_RITUALS.length;

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
      <div className="mb-4 flex items-center gap-2">
        <ListChecks size={18} weight="duotone" className="text-[var(--methodology-deep-work)]" />
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Pre-Session Ritual</h3>
      </div>

      {allDone && (
        <div className="mb-4 rounded-[var(--radius-md)] bg-[var(--color-success)]/10 p-3 text-center text-sm font-medium text-[var(--color-success)]">
          Ready for deep work!
        </div>
      )}

      <ul className="space-y-2">
        {DEFAULT_RITUALS.map((ritual, i) => {
          const done = completed.has(i);
          return (
            <li key={i}>
              <button
                onClick={() => toggle(i)}
                className="flex w-full items-center gap-3 rounded-[var(--radius-md)] p-2 text-left transition-colors hover:bg-[var(--surface-secondary)]"
              >
                {done ? (
                  <CheckCircle size={16} weight="fill" className="shrink-0 text-[var(--color-success)]" />
                ) : (
                  <Circle size={16} className="shrink-0 text-[var(--text-tertiary)]" />
                )}
                <span className={`text-sm ${done ? "text-[var(--text-tertiary)] line-through" : "text-[var(--text-primary)]"}`}>
                  {ritual}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
