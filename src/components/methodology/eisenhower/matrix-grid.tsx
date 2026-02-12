"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { Quadrant } from "./quadrant";
import { TaskCard } from "./task-card";

export type EisenhowerQuadrant = "do" | "schedule" | "delegate" | "eliminate";

export interface MatrixTask {
  id: string;
  title: string;
  quadrant: EisenhowerQuadrant;
  priority: string;
  dueDate?: string;
}

interface MatrixGridProps {
  tasks: MatrixTask[];
  onMoveTask: (taskId: string, quadrant: EisenhowerQuadrant) => void;
}

const QUADRANTS: {
  id: EisenhowerQuadrant;
  label: string;
  subtitle: string;
  color: string;
  bgClass: string;
}[] = [
  {
    id: "do",
    label: "Do",
    subtitle: "Urgent & Important",
    color: "var(--color-error)",
    bgClass: "bg-red-50",
  },
  {
    id: "schedule",
    label: "Schedule",
    subtitle: "Important, Not Urgent",
    color: "var(--color-eisenhower)",
    bgClass: "bg-blue-50",
  },
  {
    id: "delegate",
    label: "Delegate",
    subtitle: "Urgent, Not Important",
    color: "var(--color-warning)",
    bgClass: "bg-amber-50",
  },
  {
    id: "eliminate",
    label: "Eliminate",
    subtitle: "Neither",
    color: "var(--text-tertiary)",
    bgClass: "bg-gray-50",
  },
];

export function MatrixGrid({ tasks, onMoveTask }: MatrixGridProps) {
  const [activeTask, setActiveTask] = useState<MatrixTask | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const task = tasks.find((t) => t.id === event.active.id);
      if (task) setActiveTask(task);
    },
    [tasks]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveTask(null);
      const { active, over } = event;
      if (!over) return;

      const taskId = active.id as string;
      const targetQuadrant = over.id as EisenhowerQuadrant;
      const task = tasks.find((t) => t.id === taskId);

      if (task && task.quadrant !== targetQuadrant) {
        onMoveTask(taskId, targetQuadrant);
      }
    },
    [tasks, onMoveTask]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {QUADRANTS.map((q) => (
          <Quadrant
            key={q.id}
            id={q.id}
            label={q.label}
            subtitle={q.subtitle}
            color={q.color}
            bgClass={q.bgClass}
            tasks={tasks.filter((t) => t.quadrant === q.id)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <TaskCard task={activeTask} isDragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
