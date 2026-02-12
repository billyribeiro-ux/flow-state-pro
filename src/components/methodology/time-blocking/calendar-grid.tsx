"use client";

import { useMemo } from "react";
import { TimeBlockItem } from "./time-block";

export interface TimeBlockData {
  id: string;
  title: string;
  startTime: string; // "09:00"
  endTime: string; // "10:00"
  blockType: string;
  color: string;
  methodology?: string;
}

interface CalendarGridProps {
  date: Date;
  blocks: TimeBlockData[];
  onBlockClick: (block: TimeBlockData) => void;
  onSlotClick: (hour: number) => void;
}

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 6am to 9pm

function timeToRow(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return ((hours ?? 0) - 6) * 4 + Math.floor((minutes ?? 0) / 15);
}

function timeToRowSpan(start: string, end: string): number {
  return timeToRow(end) - timeToRow(start);
}

export function CalendarGrid({
  blocks,
  onBlockClick,
  onSlotClick,
}: CalendarGridProps) {
  const positionedBlocks = useMemo(
    () =>
      blocks.map((block) => ({
        ...block,
        row: timeToRow(block.startTime),
        span: timeToRowSpan(block.startTime, block.endTime),
      })),
    [blocks]
  );

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] shadow-[var(--shadow-xs)]">
      <div className="relative grid grid-cols-[60px_1fr]">
        {/* Time labels */}
        <div className="border-r border-[var(--border-subtle)]">
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="flex h-16 items-start justify-end border-b border-[var(--border-subtle)] pr-2 pt-0.5"
            >
              <span className="text-[10px] font-medium text-[var(--text-tertiary)]">
                {hour === 0
                  ? "12 AM"
                  : hour < 12
                    ? `${hour} AM`
                    : hour === 12
                      ? "12 PM"
                      : `${hour - 12} PM`}
              </span>
            </div>
          ))}
        </div>

        {/* Grid slots */}
        <div className="relative">
          {HOURS.map((hour) => (
            <button
              key={hour}
              onClick={() => onSlotClick(hour)}
              className="block h-16 w-full border-b border-[var(--border-subtle)] transition-colors hover:bg-[var(--surface-secondary)]"
              aria-label={`Add block at ${hour}:00`}
            />
          ))}

          {/* Positioned blocks */}
          {positionedBlocks.map((block) => (
            <div
              key={block.id}
              className="absolute left-1 right-1"
              style={{
                top: `${block.row * 4}px`,
                height: `${Math.max(block.span * 4, 32)}px`,
              }}
            >
              <TimeBlockItem block={block} onClick={() => onBlockClick(block)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
