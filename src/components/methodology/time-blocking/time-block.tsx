"use client";

import { cn } from "@/lib/utils/cn";
import type { TimeBlockData } from "./calendar-grid";

interface TimeBlockItemProps {
  block: TimeBlockData;
  onClick: () => void;
}

export function TimeBlockItem({ block, onClick }: TimeBlockItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-full w-full flex-col justify-start overflow-hidden rounded-[var(--radius-md)] border-l-4 px-2 py-1 text-left transition-shadow hover:shadow-[var(--shadow-sm)]"
      )}
      style={{
        borderLeftColor: block.color,
        backgroundColor: `${block.color}10`,
      }}
    >
      <p className="truncate text-xs font-medium text-[var(--text-primary)]">
        {block.title}
      </p>
      <p className="text-[10px] text-[var(--text-tertiary)]">
        {block.startTime} – {block.endTime}
      </p>
    </button>
  );
}
