"use client";

import { CheckCircle, Circle, DotsThree, Clock, Tag } from "@phosphor-icons/react";

interface TaskCardProps {
  id: string;
  title: string;
  completed?: boolean;
  priority?: "low" | "medium" | "high";
  dueDate?: string;
  tags?: string[];
  onToggle?: (id: string) => void;
  onClick?: (id: string) => void;
}

const PRIORITY_COLORS = {
  low: "var(--text-tertiary)",
  medium: "var(--color-warning)",
  high: "var(--color-error)",
};

export function TaskCard({
  id,
  title,
  completed = false,
  priority = "medium",
  dueDate,
  tags = [],
  onToggle,
  onClick,
}: TaskCardProps) {
  return (
    <div
      onClick={() => onClick?.(id)}
      className={`group flex items-start gap-3 rounded-[var(--radius-lg)] border p-3 transition-colors ${
        completed
          ? "border-[var(--border-subtle)] bg-[var(--surface-secondary)]/50"
          : "border-[var(--border-subtle)] hover:border-[var(--border-default)]"
      } ${onClick ? "cursor-pointer" : ""}`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle?.(id);
        }}
        className="mt-0.5 shrink-0"
      >
        {completed ? (
          <CheckCircle size={18} weight="fill" className="text-[var(--color-success)]" />
        ) : (
          <Circle size={18} className="text-[var(--text-tertiary)] hover:text-[var(--color-brand-500)]" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`text-sm ${
            completed
              ? "text-[var(--text-tertiary)] line-through"
              : "text-[var(--text-primary)]"
          }`}
        >
          {title}
        </p>

        {(dueDate || tags.length > 0) && (
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            {dueDate && (
              <span className="flex items-center gap-1 text-[10px] text-[var(--text-tertiary)]">
                <Clock size={10} />
                {dueDate}
              </span>
            )}
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-0.5 rounded-full bg-[var(--surface-secondary)] px-1.5 py-0.5 text-[10px] text-[var(--text-tertiary)]"
              >
                <Tag size={8} />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: PRIORITY_COLORS[priority] }}
        title={priority}
      />
    </div>
  );
}
