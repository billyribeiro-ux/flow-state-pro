"use client";

import { useState } from "react";
import { ChartBar, Star, DotsThree, Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface ParetoTask {
  id: string;
  title: string;
  category: "vital_few" | "trivial_many";
  impactScore: number;
  completed: boolean;
}

export function ParetoWorkspace() {
  const [tasks, setTasks] = useState<ParetoTask[]>([]);

  const vitalFew = tasks.filter((t) => t.category === "vital_few");
  const trivialMany = tasks.filter((t) => t.category === "trivial_many");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">80/20 Rule (Pareto)</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Focus on the 20% of tasks that drive 80% of your results.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Vital Few (20%) */}
        <div className="rounded-[var(--radius-xl)] border-2 border-[var(--methodology-pareto)] bg-[var(--surface-primary)] p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star size={20} weight="fill" className="text-[var(--methodology-pareto)]" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Vital Few (20%)</h2>
            </div>
            <span className="rounded-full bg-[var(--methodology-pareto)]/10 px-2.5 py-1 text-xs font-bold text-[var(--methodology-pareto)]">
              High Impact
            </span>
          </div>
          <p className="mb-4 text-xs text-[var(--text-tertiary)]">
            These tasks drive 80% of your results
          </p>

          {vitalFew.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <Star size={32} weight="duotone" className="text-[var(--text-tertiary)]" />
              <p className="text-sm text-[var(--text-secondary)]">Identify your highest-impact tasks</p>
              <Button size="sm">
                <Plus size={14} className="mr-1.5" />
                Add Vital Task
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {vitalFew.map((task) => (
                <div key={task.id} className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border-subtle)] p-3">
                  <Star size={14} weight="fill" className="shrink-0 text-[var(--methodology-pareto)]" />
                  <span className="flex-1 text-sm text-[var(--text-primary)]">{task.title}</span>
                  <span className="text-xs font-medium text-[var(--methodology-pareto)]">{task.impactScore}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trivial Many (80%) */}
        <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DotsThree size={20} className="text-[var(--text-tertiary)]" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Trivial Many (80%)</h2>
            </div>
            <span className="rounded-full bg-[var(--surface-secondary)] px-2.5 py-1 text-xs font-bold text-[var(--text-tertiary)]">
              Low Impact
            </span>
          </div>
          <p className="mb-4 text-xs text-[var(--text-tertiary)]">
            These tasks only drive 20% of your results
          </p>

          {trivialMany.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <DotsThree size={32} className="text-[var(--text-tertiary)]" />
              <p className="text-sm text-[var(--text-secondary)]">Tasks to delegate, batch, or eliminate</p>
              <Button size="sm" variant="outline">
                <Plus size={14} className="mr-1.5" />
                Add Task
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {trivialMany.map((task) => (
                <div key={task.id} className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border-subtle)] p-3">
                  <span className="flex-1 text-sm text-[var(--text-secondary)]">{task.title}</span>
                  <span className="text-xs text-[var(--text-tertiary)]">{task.impactScore}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pareto Analysis */}
      <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
        <div className="flex items-center gap-2">
          <ChartBar size={18} className="text-[var(--text-tertiary)]" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Pareto Analysis</h3>
        </div>
        <p className="mt-3 text-center text-sm text-[var(--text-tertiary)]">
          Add tasks to see your 80/20 distribution chart
        </p>
      </div>
    </div>
  );
}
