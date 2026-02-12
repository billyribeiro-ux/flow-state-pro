"use client";

import { useState } from "react";
import { ProhibitInset, Plus, X } from "@phosphor-icons/react";

interface BlockedItem {
  id: string;
  label: string;
  type: "website" | "app" | "notification";
}

const DEFAULTS: BlockedItem[] = [
  { id: "social", label: "Social Media", type: "website" },
  { id: "email", label: "Email Client", type: "app" },
  { id: "slack", label: "Slack / Teams", type: "app" },
  { id: "news", label: "News Sites", type: "website" },
  { id: "notifs", label: "System Notifications", type: "notification" },
];

export function DistractionBlocker() {
  const [blocked, setBlocked] = useState<Set<string>>(new Set());
  const [isActive, setIsActive] = useState(false);

  const toggleItem = (id: string) => {
    setBlocked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ProhibitInset size={18} weight="duotone" className="text-[var(--methodology-deep-work)]" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Distraction Blocker</h3>
        </div>
        <button
          onClick={() => setIsActive(!isActive)}
          className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
            isActive
              ? "bg-[var(--color-error)] text-white"
              : "bg-[var(--surface-secondary)] text-[var(--text-secondary)]"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </button>
      </div>

      <div className="space-y-2">
        {DEFAULTS.map((item) => {
          const isBlocked = blocked.has(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`flex w-full items-center gap-3 rounded-[var(--radius-md)] border p-3 text-left transition-colors ${
                isBlocked
                  ? "border-[var(--color-error)]/30 bg-[var(--color-error)]/5"
                  : "border-[var(--border-subtle)]"
              }`}
            >
              <ProhibitInset
                size={14}
                className={isBlocked ? "text-[var(--color-error)]" : "text-[var(--text-tertiary)]"}
              />
              <span className={`flex-1 text-sm ${isBlocked ? "text-[var(--color-error)]" : "text-[var(--text-primary)]"}`}>
                {item.label}
              </span>
              <span className="rounded-full bg-[var(--surface-secondary)] px-2 py-0.5 text-[10px] text-[var(--text-tertiary)]">
                {item.type}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
