"use client";

import { useState } from "react";
import { Clock, Play, Stop, Plus, ChartPie } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface TimeEntry {
  id: string;
  category: string;
  description: string;
  startTime: string;
  endTime: string | null;
  durationMinutes: number;
}

const TIME_CATEGORIES = [
  { id: "deep_work", label: "Deep Work", color: "#4c6ef5" },
  { id: "meetings", label: "Meetings", color: "#ae3ec9" },
  { id: "email", label: "Email/Communication", color: "#f76707" },
  { id: "admin", label: "Admin", color: "#20c997" },
  { id: "breaks", label: "Breaks", color: "#868e96" },
  { id: "learning", label: "Learning", color: "#fab005" },
  { id: "personal", label: "Personal", color: "#e64980" },
  { id: "other", label: "Other", color: "#495057" },
];

export function TimeAuditWorkspace() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const totalMinutes = entries.reduce((sum, e) => sum + e.durationMinutes, 0);
  const categoryBreakdown = TIME_CATEGORIES.map((cat) => {
    const minutes = entries
      .filter((e) => e.category === cat.id)
      .reduce((sum, e) => sum + e.durationMinutes, 0);
    return { ...cat, minutes, percentage: totalMinutes > 0 ? Math.round((minutes / totalMinutes) * 100) : 0 };
  }).filter((c) => c.minutes > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Time Audit</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Track how you actually spend your time to identify patterns and optimize.
        </p>
      </div>

      {/* Quick Track */}
      <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Track Time</h2>
          {isTracking && (
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-[var(--color-error)]" />
              <span className="text-sm font-medium text-[var(--color-error)]">Recording...</span>
            </div>
          )}
        </div>

        {/* Category Selection */}
        <div className="mb-4 flex flex-wrap gap-2">
          {TIME_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                activeCategory === cat.id
                  ? "text-white"
                  : "bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
              style={activeCategory === cat.id ? { backgroundColor: cat.color } : {}}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          {!isTracking ? (
            <Button
              onClick={() => {
                if (activeCategory) setIsTracking(true);
              }}
              disabled={!activeCategory}
            >
              <Play size={16} weight="fill" className="mr-2" />
              Start Tracking
            </Button>
          ) : (
            <Button variant="destructive" onClick={() => setIsTracking(false)}>
              <Stop size={16} weight="fill" className="mr-2" />
              Stop Tracking
            </Button>
          )}
        </div>
      </div>

      {/* Distribution */}
      <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
        <div className="mb-4 flex items-center gap-2">
          <ChartPie size={18} className="text-[var(--text-tertiary)]" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Time Distribution</h3>
        </div>

        {categoryBreakdown.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <Clock size={40} weight="duotone" className="text-[var(--text-tertiary)]" />
            <p className="text-sm text-[var(--text-secondary)]">
              Start tracking to see your time distribution
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {categoryBreakdown.map((cat) => (
              <div key={cat.id} className="flex items-center gap-3">
                <div
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="w-36 text-sm text-[var(--text-primary)]">{cat.label}</span>
                <div className="flex-1">
                  <div className="h-2 w-full rounded-full bg-[var(--surface-secondary)]">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
                <span className="w-12 text-right text-xs font-medium text-[var(--text-secondary)]">
                  {cat.percentage}%
                </span>
                <span className="w-16 text-right text-xs text-[var(--text-tertiary)]">
                  {Math.floor(cat.minutes / 60)}h {cat.minutes % 60}m
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Entries */}
      <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Today&apos;s Log</h3>
        {entries.length === 0 ? (
          <p className="mt-4 text-center text-sm text-[var(--text-tertiary)]">
            No time entries logged today
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {entries.map((entry) => {
              const cat = TIME_CATEGORIES.find((c) => c.id === entry.category);
              return (
                <div key={entry.id} className="flex items-center gap-3 rounded-[var(--radius-md)] p-2">
                  <div
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: cat?.color ?? "#868e96" }}
                  />
                  <span className="flex-1 text-sm text-[var(--text-primary)]">
                    {entry.description || cat?.label}
                  </span>
                  <span className="text-xs text-[var(--text-tertiary)]">
                    {entry.durationMinutes}m
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
