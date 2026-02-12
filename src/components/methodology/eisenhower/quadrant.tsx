"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils/cn";
import { TaskCard } from "./task-card";
import type { MatrixTask, EisenhowerQuadrant } from "./matrix-grid";

interface QuadrantProps {
  id: EisenhowerQuadrant;
  label: string;
  subtitle: string;
  color: string;
  bgClass: string;
  tasks: MatrixTask[];
}

export function Quadrant({
  id,
  label,
  subtitle,
  color,
  bgClass,
  tasks,
}: QuadrantProps) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-h-[200px] flex-col rounded-[var(--radius-xl)] border-2 p-4 transition-all sm:min-h-[280px]",
        isOver
          ? "border-[var(--color-brand-500)] shadow-[var(--shadow-md)]"
          : "border-[var(--border-subtle)]",
        bgClass
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3
            className="text-sm font-bold"
            style={{ color }}
          >
            {label}
          </h3>
          <p className="text-[10px] text-[var(--text-tertiary)]">{subtitle}</p>
        </div>
        <span
          className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: color }}
        >
          {tasks.length}
        </span>
      </div>

      {/* Tasks */}
      <div className="flex flex-1 flex-col gap-2">
        {tasks.length === 0 && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-xs text-[var(--text-tertiary)]">
              Drop tasks here
            </p>
          </div>
        )}
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
