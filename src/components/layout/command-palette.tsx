"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlass,
  Timer,
  GridFour,
  CalendarBlank,
  Lightning,
  House,
  ChartBar,
  Gear,
  Robot,
  Tray,
  Brain,
  FishSimple,
  Stack,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils/cn";
import { useUIStore } from "@/lib/stores/ui-store";
import { ROUTES } from "@/lib/constants/routes";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  href: string;
  category: string;
}

const COMMANDS: CommandItem[] = [
  { id: "dashboard", label: "Dashboard", icon: House, href: ROUTES.dashboard, category: "Navigation" },
  { id: "pomodoro", label: "Pomodoro Timer", icon: Timer, href: ROUTES.techniques.pomodoro, category: "Techniques" },
  { id: "eisenhower", label: "Eisenhower Matrix", icon: GridFour, href: ROUTES.techniques.eisenhower, category: "Techniques" },
  { id: "time-blocking", label: "Time Blocking", icon: CalendarBlank, href: ROUTES.techniques.timeBlocking, category: "Techniques" },
  { id: "two-minute", label: "Two-Minute Rule", icon: Lightning, href: ROUTES.techniques.twoMinute, category: "Techniques" },
  { id: "gtd", label: "Getting Things Done", icon: Tray, href: ROUTES.techniques.gtd, category: "Techniques" },
  { id: "deep-work", label: "Deep Work", icon: Brain, href: ROUTES.techniques.deepWork, category: "Techniques" },
  { id: "eat-the-frog", label: "Eat The Frog", icon: FishSimple, href: ROUTES.techniques.eatTheFrog, category: "Techniques" },
  { id: "pareto", label: "80/20 Rule", icon: ChartBar, href: ROUTES.techniques.pareto, category: "Techniques" },
  { id: "batch", label: "Batch Processing", icon: Stack, href: ROUTES.techniques.batch, category: "Techniques" },
  { id: "coach", label: "AI Coach", icon: Robot, href: ROUTES.coach, category: "Navigation" },
  { id: "analytics", label: "Analytics", icon: ChartBar, href: ROUTES.analytics, category: "Navigation" },
  { id: "settings", label: "Settings", icon: Gear, href: ROUTES.settings, category: "Navigation" },
];

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return COMMANDS;
    const q = query.toLowerCase();
    return COMMANDS.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(q) ||
        cmd.category.toLowerCase().includes(q) ||
        (cmd.description?.toLowerCase().includes(q) ?? false)
    );
  }, [query]);

  const grouped = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    for (const item of filtered) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    }
    return groups;
  }, [filtered]);

  const flatItems = useMemo(() => filtered, [filtered]);

  // Reset on open
  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const handleSelect = useCallback(
    (item: CommandItem) => {
      setCommandPaletteOpen(false);
      router.push(item.href);
    },
    [router, setCommandPaletteOpen]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, flatItems.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && flatItems[selectedIndex]) {
        handleSelect(flatItems[selectedIndex]);
      } else if (e.key === "Escape") {
        setCommandPaletteOpen(false);
      }
    },
    [flatItems, selectedIndex, handleSelect, setCommandPaletteOpen]
  );

  if (!commandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-[var(--z-modal)]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[var(--surface-overlay)]"
        onClick={() => setCommandPaletteOpen(false)}
        aria-hidden="true"
      />

      {/* Palette */}
      <div className="relative mx-auto mt-[20vh] w-full max-w-lg px-4">
        <div
          className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-elevated)] shadow-[var(--shadow-xl)]"
          role="dialog"
          aria-label="Command palette"
        >
          {/* Search input */}
          <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] px-4">
            <MagnifyingGlass size={18} className="shrink-0 text-[var(--text-tertiary)]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search commands..."
              className="h-12 w-full bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
            />
            <kbd className="hidden rounded border border-[var(--border-default)] bg-[var(--surface-secondary)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-tertiary)] sm:inline-block">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-72 overflow-y-auto p-2">
            {flatItems.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-[var(--text-tertiary)]">No results found</p>
              </div>
            ) : (
              Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                  <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                    {category}
                  </p>
                  {items.map((item) => {
                    const globalIndex = flatItems.indexOf(item);
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-left text-sm transition-colors",
                          globalIndex === selectedIndex
                            ? "bg-[var(--color-brand-50)] text-[var(--color-brand-700)]"
                            : "text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]"
                        )}
                      >
                        <item.icon size={18} className="shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
