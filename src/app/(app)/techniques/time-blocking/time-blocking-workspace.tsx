"use client";

import { useState, useCallback } from "react";
import { format } from "date-fns";
import { Plus, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  CalendarGrid,
  type TimeBlockData,
} from "@/components/methodology/time-blocking/calendar-grid";

const DEMO_BLOCKS: TimeBlockData[] = [
  {
    id: "1",
    title: "Deep Focus: Project Alpha",
    startTime: "09:00",
    endTime: "11:00",
    blockType: "focus",
    color: "var(--color-time-blocking)",
  },
  {
    id: "2",
    title: "Team Standup",
    startTime: "11:00",
    endTime: "11:30",
    blockType: "meeting",
    color: "#868e96",
  },
  {
    id: "3",
    title: "Lunch Break",
    startTime: "12:00",
    endTime: "13:00",
    blockType: "break",
    color: "var(--color-success)",
  },
  {
    id: "4",
    title: "Email & Admin",
    startTime: "14:00",
    endTime: "15:00",
    blockType: "admin",
    color: "var(--color-warning)",
  },
];

export function TimeBlockingWorkspace() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [blocks] = useState<TimeBlockData[]>(DEMO_BLOCKS);

  const handlePrevDay = useCallback(() => {
    setCurrentDate(
      (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1)
    );
  }, []);

  const handleNextDay = useCallback(() => {
    setCurrentDate(
      (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
    );
  }, []);

  const handleBlockClick = useCallback((_block: TimeBlockData) => {
    // TODO: Open block editor
  }, []);

  const handleSlotClick = useCallback((_hour: number) => {
    // TODO: Open block creator
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
            Time Blocking
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Own your calendar, own your day.
          </p>
        </div>
        <Button size="sm" className="gap-2 self-start">
          <Plus size={16} />
          Add Block
        </Button>
      </div>

      {/* Date navigation */}
      <div className="flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] px-4 py-2 shadow-[var(--shadow-xs)]">
        <Button variant="ghost" size="icon-sm" onClick={handlePrevDay} aria-label="Previous day">
          <CaretLeft size={18} />
        </Button>
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">
          {format(currentDate, "EEEE, MMMM d, yyyy")}
        </h2>
        <Button variant="ghost" size="icon-sm" onClick={handleNextDay} aria-label="Next day">
          <CaretRight size={18} />
        </Button>
      </div>

      {/* Calendar */}
      <CalendarGrid
        date={currentDate}
        blocks={blocks}
        onBlockClick={handleBlockClick}
        onSlotClick={handleSlotClick}
      />
    </div>
  );
}
