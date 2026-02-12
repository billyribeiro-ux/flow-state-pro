"use client";

import { useState, useCallback } from "react";
import { Lightning, Check, X, Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export interface QuickTask {
  id: string;
  title: string;
  estimatedMinutes: number;
  status: "pending" | "completed" | "skipped";
}

interface QuickQueueProps {
  tasks: QuickTask[];
  onComplete: (taskId: string) => void;
  onSkip: (taskId: string) => void;
  onAdd: (title: string) => void;
}

export function QuickQueue({ tasks, onComplete, onSkip, onAdd }: QuickQueueProps) {
  const [newTask, setNewTask] = useState("");
  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const completedCount = tasks.filter((t) => t.status === "completed").length;

  const handleAdd = useCallback(() => {
    if (newTask.trim()) {
      onAdd(newTask.trim());
      setNewTask("");
    }
  }, [newTask, onAdd]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleAdd();
    },
    [handleAdd]
  );

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-4 shadow-[var(--shadow-xs)]">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-[var(--text-primary)]">
            {completedCount} of {tasks.length} cleared
          </p>
          <p className="text-xs text-[var(--text-tertiary)]">
            ~{pendingTasks.length * 2} min remaining
          </p>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--surface-tertiary)]">
          <div
            className="h-full rounded-full bg-[var(--color-two-minute)] transition-all duration-500"
            style={{
              width: tasks.length > 0 ? `${(completedCount / tasks.length) * 100}%` : "0%",
            }}
          />
        </div>
      </div>

      {/* Add task input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a quick task (under 2 minutes)..."
          className="flex-1 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-primary)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--color-two-minute)] focus:outline-none focus:ring-2 focus:ring-[var(--color-two-minute)]/20"
        />
        <Button
          size="default"
          onClick={handleAdd}
          disabled={!newTask.trim()}
          className="gap-1 bg-[var(--color-two-minute)] hover:bg-[var(--color-two-minute)]/90"
        >
          <Plus size={16} />
          Add
        </Button>
      </div>

      {/* Task queue */}
      <div className="space-y-2">
        {pendingTasks.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-[var(--radius-xl)] border border-dashed border-[var(--border-default)] bg-[var(--surface-secondary)] py-12 text-center">
            <Lightning size={32} weight="duotone" className="text-[var(--color-two-minute)]" />
            <p className="text-sm font-medium text-[var(--text-primary)]">
              {completedCount > 0 ? "All clear! 🎉" : "No quick tasks yet"}
            </p>
            <p className="text-xs text-[var(--text-tertiary)]">
              {completedCount > 0
                ? "You crushed it. Zero overhead."
                : "Add tasks that take 2 minutes or less."}
            </p>
          </div>
        )}

        {pendingTasks.map((task, index) => (
          <div
            key={task.id}
            className={cn(
              "flex items-center gap-3 rounded-[var(--radius-lg)] border bg-[var(--surface-primary)] p-3 shadow-[var(--shadow-xs)] transition-all",
              index === 0
                ? "border-[var(--color-two-minute)] ring-2 ring-[var(--color-two-minute)]/10"
                : "border-[var(--border-subtle)]"
            )}
          >
            {index === 0 && (
              <Lightning
                size={18}
                weight="fill"
                className="shrink-0 text-[var(--color-two-minute)]"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className={cn(
                "truncate text-sm text-[var(--text-primary)]",
                index === 0 && "font-semibold"
              )}>
                {task.title}
              </p>
              <p className="text-[10px] text-[var(--text-tertiary)]">
                ~{task.estimatedMinutes} min
              </p>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onComplete(task.id)}
                className="text-[var(--color-success)] hover:bg-emerald-50"
                aria-label={`Complete: ${task.title}`}
              >
                <Check size={18} weight="bold" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onSkip(task.id)}
                className="text-[var(--text-tertiary)] hover:text-[var(--color-error)]"
                aria-label={`Skip: ${task.title}`}
              >
                <X size={18} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
