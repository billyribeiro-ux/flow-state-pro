"use client";

import { useState } from "react";
import { Plus, Tag, CalendarBlank } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface TaskInputProps {
  onSubmit: (task: { title: string; priority?: string; dueDate?: string }) => void;
  placeholder?: string;
  showPriority?: boolean;
}

const PRIORITIES = [
  { value: "low", label: "Low", color: "var(--text-tertiary)" },
  { value: "medium", label: "Med", color: "var(--color-warning)" },
  { value: "high", label: "High", color: "var(--color-error)" },
];

export function TaskInput({
  onSubmit,
  placeholder = "Add a task...",
  showPriority = true,
}: TaskInputProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), priority });
    setTitle("");
    setExpanded(false);
  };

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-3 transition-all focus-within:border-[var(--color-brand-500)]">
      <div className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setExpanded(true)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
        />
        <Button size="sm" onClick={handleSubmit} disabled={!title.trim()}>
          <Plus size={14} />
        </Button>
      </div>

      {expanded && showPriority && (
        <div className="mt-2 flex items-center gap-2 border-t border-[var(--border-subtle)] pt-2">
          <Tag size={12} className="text-[var(--text-tertiary)]" />
          {PRIORITIES.map((p) => (
            <button
              key={p.value}
              onClick={() => setPriority(p.value)}
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${
                priority === p.value
                  ? "text-white"
                  : "bg-[var(--surface-secondary)] text-[var(--text-secondary)]"
              }`}
              style={priority === p.value ? { backgroundColor: p.color } : {}}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
