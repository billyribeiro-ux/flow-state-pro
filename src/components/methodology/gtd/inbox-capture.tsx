"use client";

import { useState } from "react";
import { Tray, Plus, Lightning } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface InboxItem {
  id: string;
  text: string;
  createdAt: string;
}

export function InboxCapture() {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [input, setInput] = useState("");

  const addItem = () => {
    if (!input.trim()) return;
    setItems((prev) => [
      { id: `inbox-${Date.now()}`, text: input.trim(), createdAt: new Date().toISOString() },
      ...prev,
    ]);
    setInput("");
  };

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
      <div className="mb-4 flex items-center gap-2">
        <Tray size={18} weight="duotone" className="text-[var(--methodology-gtd)]" />
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Inbox Capture</h3>
        <span className="ml-auto rounded-full bg-[var(--methodology-gtd)]/10 px-2 py-0.5 text-xs font-bold text-[var(--methodology-gtd)]">
          {items.length}
        </span>
      </div>

      <div className="mb-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          placeholder="Capture anything on your mind..."
          className="flex-1 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--methodology-gtd)] focus:outline-none"
        />
        <Button size="sm" onClick={addItem} disabled={!input.trim()}>
          <Plus size={14} />
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="py-4 text-center text-sm text-[var(--text-tertiary)]">
          Your inbox is empty — capture tasks, ideas, and thoughts here
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border-subtle)] p-3">
              <Lightning size={14} className="shrink-0 text-[var(--methodology-gtd)]" />
              <span className="flex-1 text-sm text-[var(--text-primary)]">{item.text}</span>
              <button
                onClick={() => setItems((prev) => prev.filter((i) => i.id !== item.id))}
                className="text-xs text-[var(--text-tertiary)] hover:text-[var(--color-error)]"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
