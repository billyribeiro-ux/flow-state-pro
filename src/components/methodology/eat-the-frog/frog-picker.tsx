"use client";

import { useState } from "react";
import { FishSimple, Star, ArrowRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  title: string;
  dreadLevel: number; // 1-5
}

interface FrogPickerProps {
  tasks: Task[];
  onSelect: (taskId: string) => void;
}

export function FrogPicker({ tasks, onSelect }: FrogPickerProps) {
  const sorted = [...tasks].sort((a, b) => b.dreadLevel - a.dreadLevel);

  if (tasks.length === 0) {
    return (
      <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <FishSimple size={40} weight="duotone" className="text-[var(--text-tertiary)]" />
          <p className="text-sm text-[var(--text-secondary)]">Add tasks to find your frog</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
      <div className="mb-4 flex items-center gap-2">
        <FishSimple size={18} weight="duotone" className="text-[var(--methodology-eat-the-frog)]" />
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Pick Your Frog</h3>
      </div>
      <p className="mb-4 text-xs text-[var(--text-tertiary)]">
        The task you dread most is your frog. Eat it first!
      </p>

      <div className="space-y-2">
        {sorted.map((task, i) => (
          <button
            key={task.id}
            onClick={() => onSelect(task.id)}
            className={`flex w-full items-center gap-3 rounded-[var(--radius-md)] border p-3 text-left transition-colors ${
              i === 0
                ? "border-[var(--methodology-eat-the-frog)] bg-[var(--methodology-eat-the-frog)]/5"
                : "border-[var(--border-subtle)] hover:border-[var(--border-default)]"
            }`}
          >
            {i === 0 && <FishSimple size={16} weight="fill" className="shrink-0 text-[var(--methodology-eat-the-frog)]" />}
            <span className="flex-1 text-sm text-[var(--text-primary)]">{task.title}</span>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star
                  key={s}
                  size={10}
                  weight={s < task.dreadLevel ? "fill" : "regular"}
                  className={s < task.dreadLevel ? "text-[var(--methodology-eat-the-frog)]" : "text-[var(--text-tertiary)]"}
                />
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
