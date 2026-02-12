"use client";

import { useState, useCallback } from "react";
import { QuickQueue, type QuickTask } from "@/components/methodology/two-minute/quick-queue";

const DEMO_TASKS: QuickTask[] = [
  { id: "1", title: "Reply to Sarah's Slack message", estimatedMinutes: 1, status: "pending" },
  { id: "2", title: "Approve PR #247", estimatedMinutes: 2, status: "pending" },
  { id: "3", title: "Update Jira ticket status", estimatedMinutes: 1, status: "pending" },
  { id: "4", title: "Send meeting notes to team", estimatedMinutes: 2, status: "pending" },
];

export function TwoMinuteWorkspace() {
  const [tasks, setTasks] = useState<QuickTask[]>(DEMO_TASKS);

  const handleComplete = useCallback((taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "completed" as const } : t))
    );
  }, []);

  const handleSkip = useCallback((taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "skipped" as const } : t))
    );
  }, []);

  const handleAdd = useCallback((title: string) => {
    setTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title,
        estimatedMinutes: 2,
        status: "pending" as const,
      },
    ]);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
          Two-Minute Rule
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          If it takes less than 2 minutes, do it now. The overhead of tracking it costs more.
        </p>
      </div>

      <div className="mx-auto max-w-xl">
        <QuickQueue
          tasks={tasks}
          onComplete={handleComplete}
          onSkip={handleSkip}
          onAdd={handleAdd}
        />
      </div>
    </div>
  );
}
