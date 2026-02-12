"use client";

import { useState } from "react";
import { Tray, FunnelSimple, ListChecks, HourglassSimple, Archive, Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

type GtdView = "inbox" | "next_action" | "waiting" | "someday" | "reference";

interface GtdItem {
  id: string;
  title: string;
  status: GtdView;
  project?: string;
  context?: string;
  createdAt: string;
}

const GTD_VIEWS: { key: GtdView; label: string; icon: React.ElementType; description: string }[] = [
  { key: "inbox", label: "Inbox", icon: Tray, description: "Capture everything here first" },
  { key: "next_action", label: "Next Actions", icon: ListChecks, description: "Concrete next steps" },
  { key: "waiting", label: "Waiting For", icon: HourglassSimple, description: "Delegated or blocked" },
  { key: "someday", label: "Someday/Maybe", icon: Archive, description: "Future possibilities" },
  { key: "reference", label: "Reference", icon: FunnelSimple, description: "Information to keep" },
];

export function GtdWorkspace() {
  const [activeView, setActiveView] = useState<GtdView>("inbox");
  const [items, setItems] = useState<GtdItem[]>([]);

  const filteredItems = items.filter((item) => item.status === activeView);
  const activeViewDef = GTD_VIEWS.find((v) => v.key === activeView)!;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Getting Things Done</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Capture, clarify, organize, reflect, engage — stress-free productivity.
        </p>
      </div>

      {/* GTD View Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {GTD_VIEWS.map((view) => {
          const Icon = view.icon;
          const count = items.filter((i) => i.status === view.key).length;
          return (
            <button
              key={view.key}
              onClick={() => setActiveView(view.key)}
              className={`flex shrink-0 items-center gap-2 rounded-[var(--radius-lg)] px-4 py-2.5 text-sm font-medium transition-colors ${
                activeView === view.key
                  ? "bg-[var(--color-brand-600)] text-white"
                  : "bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Icon size={16} />
              {view.label}
              {count > 0 && (
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  activeView === view.key
                    ? "bg-white/20 text-white"
                    : "bg-[var(--surface-tertiary)] text-[var(--text-tertiary)]"
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active View Content */}
      <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">{activeViewDef.label}</h2>
            <p className="text-xs text-[var(--text-tertiary)]">{activeViewDef.description}</p>
          </div>
          <Button size="sm">
            <Plus size={14} className="mr-1.5" />
            Add Item
          </Button>
        </div>

        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <activeViewDef.icon size={40} weight="duotone" className="text-[var(--text-tertiary)]" />
            <p className="text-sm text-[var(--text-secondary)]">
              {activeView === "inbox"
                ? "Your inbox is empty. Capture new items here."
                : `No items in ${activeViewDef.label.toLowerCase()} yet.`}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border-subtle)] p-3 transition-colors hover:bg-[var(--surface-secondary)]"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{item.title}</p>
                  {item.project && (
                    <p className="text-xs text-[var(--text-tertiary)]">Project: {item.project}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
