"use client";

import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils/cn";
import type { MatrixTask } from "./matrix-grid";

interface TaskCardProps {
  task: MatrixTask;
  isDragging?: boolean;
}

export function TaskCard({ task, isDragging = false }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "cursor-grab rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] px-3 py-2 text-sm shadow-[var(--shadow-xs)] transition-shadow active:cursor-grabbing",
        isDragging && "rotate-2 shadow-[var(--shadow-lg)] opacity-90",
        "hover:shadow-[var(--shadow-sm)]"
      )}
      role="listitem"
      aria-label={`Task: ${task.title}`}
    >
      <p className="truncate text-xs font-medium text-[var(--text-primary)]">
        {task.title}
      </p>
      {task.dueDate && (
        <p className="mt-0.5 text-[10px] text-[var(--text-tertiary)]">
          Due: {task.dueDate}
        </p>
      )}
    </div>
  );
}
