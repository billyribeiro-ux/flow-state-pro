"use client";

import { useState, useCallback } from "react";
import { Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  MatrixGrid,
  type MatrixTask,
  type EisenhowerQuadrant,
} from "@/components/methodology/eisenhower/matrix-grid";

const DEMO_TASKS: MatrixTask[] = [
  { id: "1", title: "Ship feature deadline", quadrant: "do", priority: "urgent" },
  { id: "2", title: "Strategic planning", quadrant: "schedule", priority: "high" },
  { id: "3", title: "Reply to emails", quadrant: "delegate", priority: "medium" },
  { id: "4", title: "Organize desktop", quadrant: "eliminate", priority: "low" },
];

export function EisenhowerWorkspace() {
  const [tasks, setTasks] = useState<MatrixTask[]>(DEMO_TASKS);

  const handleMoveTask = useCallback(
    (taskId: string, quadrant: EisenhowerQuadrant) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, quadrant } : t))
      );
    },
    []
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
            Eisenhower Matrix
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Separate urgent from important. Drag tasks between quadrants.
          </p>
        </div>
        <Button size="sm" className="gap-2 self-start">
          <Plus size={16} />
          Add Task
        </Button>
      </div>

      {/* Matrix */}
      <MatrixGrid tasks={tasks} onMoveTask={handleMoveTask} />
    </div>
  );
}
