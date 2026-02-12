"use client";

import { SquaresFour, CheckCircle, Play } from "@phosphor-icons/react";

interface CategoryCardProps {
  name: string;
  color: string;
  taskCount: number;
  completedCount: number;
  isActive?: boolean;
  onSelect?: () => void;
  onStart?: () => void;
}

export function CategoryCard({
  name,
  color,
  taskCount,
  completedCount,
  isActive = false,
  onSelect,
  onStart,
}: CategoryCardProps) {
  const progress = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;

  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-[var(--radius-xl)] border p-5 transition-all ${
        isActive
          ? "border-transparent shadow-md ring-2"
          : "border-[var(--border-subtle)] hover:border-[var(--border-default)]"
      }`}
      style={isActive ? { ["--tw-ring-color" as string]: color } : {}}
    >
      <div className="mb-3 flex items-center justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)]"
          style={{ backgroundColor: `${color}15` }}
        >
          <SquaresFour size={20} weight="duotone" style={{ color }} />
        </div>
        {taskCount > 0 && (
          <div className="flex items-center gap-1.5">
            <CheckCircle size={12} weight="fill" className="text-[var(--color-success)]" />
            <span className="text-xs font-medium text-[var(--text-secondary)]">
              {completedCount}/{taskCount}
            </span>
          </div>
        )}
      </div>

      <h4 className="text-sm font-semibold text-[var(--text-primary)]">{name}</h4>

      {taskCount > 0 && (
        <div className="mt-3">
          <div className="h-1.5 w-full rounded-full bg-[var(--surface-secondary)]">
            <div
              className="h-1.5 rounded-full transition-all"
              style={{ width: `${progress}%`, backgroundColor: color }}
            />
          </div>
        </div>
      )}

      {taskCount > 0 && onStart && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStart();
          }}
          className="mt-3 flex items-center gap-1.5 text-xs font-medium transition-colors hover:opacity-80"
          style={{ color }}
        >
          <Play size={10} weight="fill" />
          Start batch
        </button>
      )}
    </div>
  );
}
