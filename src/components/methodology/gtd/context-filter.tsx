"use client";

import { useState } from "react";
import { MapPin, Phone, Desktop, House, Briefcase, UsersThree } from "@phosphor-icons/react";

const CONTEXTS = [
  { id: "anywhere", label: "Anywhere", icon: MapPin },
  { id: "phone", label: "Phone", icon: Phone },
  { id: "computer", label: "Computer", icon: Desktop },
  { id: "home", label: "Home", icon: House },
  { id: "office", label: "Office", icon: Briefcase },
  { id: "people", label: "With People", icon: UsersThree },
];

interface ContextFilterProps {
  selected: string[];
  onChange: (contexts: string[]) => void;
}

export function ContextFilter({ selected, onChange }: ContextFilterProps) {
  const toggle = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((c) => c !== id)
        : [...selected, id]
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {CONTEXTS.map((ctx) => {
        const Icon = ctx.icon;
        const isActive = selected.includes(ctx.id);
        return (
          <button
            key={ctx.id}
            onClick={() => toggle(ctx.id)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              isActive
                ? "bg-[var(--methodology-gtd)] text-white"
                : "bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Icon size={12} />
            {ctx.label}
          </button>
        );
      })}
    </div>
  );
}
