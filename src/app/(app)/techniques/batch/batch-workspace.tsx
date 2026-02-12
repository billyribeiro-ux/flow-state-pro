"use client";

import { useState } from "react";
import { SquaresFour, Plus, Play, CheckCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface BatchCategory {
  id: string;
  name: string;
  color: string;
  taskCount: number;
  completedCount: number;
}

const DEFAULT_CATEGORIES: BatchCategory[] = [
  { id: "email", name: "Email & Messages", color: "#4c6ef5", taskCount: 0, completedCount: 0 },
  { id: "admin", name: "Admin & Paperwork", color: "#ae3ec9", taskCount: 0, completedCount: 0 },
  { id: "creative", name: "Creative Work", color: "#f76707", taskCount: 0, completedCount: 0 },
  { id: "meetings", name: "Meetings & Calls", color: "#20c997", taskCount: 0, completedCount: 0 },
  { id: "errands", name: "Errands & Tasks", color: "#fab005", taskCount: 0, completedCount: 0 },
];

export function BatchWorkspace() {
  const [categories, setCategories] = useState<BatchCategory[]>(DEFAULT_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Batch Processing</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Group similar tasks together to minimize context switching and maximize efficiency.
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
            className={`group flex flex-col rounded-[var(--radius-xl)] border p-5 text-left transition-all ${
              activeCategory === category.id
                ? "border-transparent ring-2 ring-offset-2"
                : "border-[var(--border-subtle)] hover:border-[var(--border-default)]"
            }`}
            style={{
              ...(activeCategory === category.id ? { ringColor: category.color } : {}),
            }}
          >
            <div className="mb-3 flex items-center justify-between">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)]"
                style={{ backgroundColor: `${category.color}15` }}
              >
                <SquaresFour size={20} weight="duotone" style={{ color: category.color }} />
              </div>
              {category.taskCount > 0 && (
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-bold text-white"
                  style={{ backgroundColor: category.color }}
                >
                  {category.taskCount}
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">{category.name}</h3>
            <p className="mt-1 text-xs text-[var(--text-tertiary)]">
              {category.taskCount === 0
                ? "No tasks yet"
                : `${category.completedCount}/${category.taskCount} completed`}
            </p>
            {category.taskCount > 0 && (
              <div className="mt-3 h-1.5 w-full rounded-full bg-[var(--surface-secondary)]">
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: `${(category.completedCount / category.taskCount) * 100}%`,
                    backgroundColor: category.color,
                  }}
                />
              </div>
            )}
          </button>
        ))}

        {/* Add Category */}
        <button className="flex flex-col items-center justify-center gap-2 rounded-[var(--radius-xl)] border border-dashed border-[var(--border-subtle)] p-5 text-[var(--text-tertiary)] transition-colors hover:border-[var(--border-default)] hover:text-[var(--text-secondary)]">
          <Plus size={24} />
          <span className="text-sm font-medium">Add Category</span>
        </button>
      </div>

      {/* Active Category Detail */}
      {activeCategory && (
        <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              {categories.find((c) => c.id === activeCategory)?.name}
            </h2>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Plus size={14} className="mr-1.5" />
                Add Task
              </Button>
              <Button size="sm">
                <Play size={14} weight="fill" className="mr-1.5" />
                Start Batch
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <SquaresFour size={40} weight="duotone" className="text-[var(--text-tertiary)]" />
            <p className="text-sm text-[var(--text-secondary)]">
              Add tasks to this batch category to get started
            </p>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Batch Processing Tips</h3>
        <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
          <li>Group similar tasks (emails, calls, admin) into dedicated time blocks</li>
          <li>Process one batch completely before moving to the next</li>
          <li>Set a timer for each batch to maintain urgency</li>
          <li>Avoid checking other categories while in a batch session</li>
        </ul>
      </div>
    </div>
  );
}
