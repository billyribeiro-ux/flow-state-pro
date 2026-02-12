"use client";

import { useState } from "react";
import { ChartLine, Fire, Clock, Target, TrendUp, CalendarBlank } from "@phosphor-icons/react";

type TimeRange = "7d" | "30d" | "90d" | "all";

export function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  const stats = [
    { label: "Total Focus Time", value: "0h 0m", icon: Clock, change: null },
    { label: "Sessions Completed", value: "0", icon: Target, change: null },
    { label: "Current Streak", value: "0 days", icon: Fire, change: null },
    { label: "Avg. Session Quality", value: "—", icon: TrendUp, change: null },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Analytics</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Track your productivity patterns and progress
          </p>
        </div>
        <div className="flex gap-1 rounded-[var(--radius-lg)] bg-[var(--surface-secondary)] p-1">
          {(["7d", "30d", "90d", "all"] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`rounded-[var(--radius-md)] px-3 py-1.5 text-xs font-medium transition-colors ${
                timeRange === range
                  ? "bg-[var(--surface-primary)] text-[var(--text-primary)] shadow-sm"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
              }`}
            >
              {range === "all" ? "All" : range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[var(--text-tertiary)]">{stat.label}</span>
                <Icon size={16} className="text-[var(--text-tertiary)]" />
              </div>
              <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Placeholder */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Focus Trend */}
        <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
          <div className="mb-4 flex items-center gap-2">
            <ChartLine size={18} className="text-[var(--text-tertiary)]" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Focus Trend</h3>
          </div>
          <div className="flex h-48 items-center justify-center">
            <p className="text-sm text-[var(--text-tertiary)]">
              Complete sessions to see your focus trend
            </p>
          </div>
        </div>

        {/* Productivity Heatmap */}
        <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
          <div className="mb-4 flex items-center gap-2">
            <CalendarBlank size={18} className="text-[var(--text-tertiary)]" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Productivity Heatmap</h3>
          </div>
          <div className="flex h-48 items-center justify-center">
            <p className="text-sm text-[var(--text-tertiary)]">
              Build consistency to see your heatmap
            </p>
          </div>
        </div>

        {/* Methodology Distribution */}
        <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
          <div className="mb-4 flex items-center gap-2">
            <Target size={18} className="text-[var(--text-tertiary)]" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Technique Usage</h3>
          </div>
          <div className="flex h-48 items-center justify-center">
            <p className="text-sm text-[var(--text-tertiary)]">
              Use different techniques to see distribution
            </p>
          </div>
        </div>

        {/* Streak Chart */}
        <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
          <div className="mb-4 flex items-center gap-2">
            <Fire size={18} className="text-[var(--text-tertiary)]" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Streak History</h3>
          </div>
          <div className="flex h-48 items-center justify-center">
            <p className="text-sm text-[var(--text-tertiary)]">
              Maintain streaks to see your history
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
