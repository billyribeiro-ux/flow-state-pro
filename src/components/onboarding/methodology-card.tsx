"use client";

import { forwardRef } from "react";
import {
  Timer,
  GridFour,
  CalendarBlank,
  Lightning,
  Tray,
  ChartBar,
  Brain,
  FishSimple,
  Stack,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils/cn";
import type { MethodologyDef } from "@/lib/constants/methodologies";
import { Badge } from "@/components/ui/badge";

const ICON_MAP: Record<string, React.ElementType> = {
  Timer,
  GridFour,
  CalendarBlank,
  Lightning,
  Tray,
  ChartBar,
  Brain,
  FishSimple,
  Stack,
  MagnifyingGlass,
};

interface MethodologyCardProps {
  methodology: MethodologyDef;
  selected: boolean;
  locked: boolean;
  onSelect: (id: string) => void;
}

export const MethodologyCard = forwardRef<HTMLButtonElement, MethodologyCardProps>(
  function MethodologyCard({ methodology, selected, locked, onSelect }, ref) {
    const Icon = ICON_MAP[methodology.icon] ?? Timer;

    return (
      <button
        ref={ref}
        onClick={() => !locked && onSelect(methodology.id)}
        disabled={locked}
        className={cn(
          "group relative flex flex-col items-start gap-3 rounded-[var(--radius-xl)] border-2 p-5 text-left transition-all duration-[var(--duration-normal)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)] focus-visible:ring-offset-2",
          selected
            ? "border-[var(--color-brand-600)] bg-[var(--color-brand-50)] shadow-[var(--shadow-md)]"
            : "border-[var(--border-subtle)] bg-[var(--surface-primary)] shadow-[var(--shadow-xs)] hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-sm)]",
          locked && "cursor-not-allowed opacity-50"
        )}
        aria-pressed={selected}
        aria-disabled={locked}
      >
        {/* Icon */}
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] transition-colors",
            selected ? "bg-white" : "bg-[var(--surface-secondary)]"
          )}
          style={
            selected
              ? { boxShadow: `0 0 0 2px ${methodology.color}` }
              : undefined
          }
        >
          <Icon
            size={24}
            weight={selected ? "fill" : "duotone"}
            style={{ color: methodology.color }}
          />
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              {methodology.name}
            </h3>
            {locked && (
              <Badge variant="secondary" className="text-[10px]">
                Phase {methodology.phase}
              </Badge>
            )}
          </div>
          <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
            {methodology.tagline}
          </p>
        </div>

        {/* Category badge */}
        <Badge
          variant="outline"
          className="mt-auto text-[10px]"
          style={
            selected
              ? { borderColor: methodology.color, color: methodology.color }
              : undefined
          }
        >
          {methodology.category}
        </Badge>

        {/* Selected indicator */}
        {selected && (
          <div
            className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: methodology.color }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6L5 9L10 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </button>
    );
  }
);
