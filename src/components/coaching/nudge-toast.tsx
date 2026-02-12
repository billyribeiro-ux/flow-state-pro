"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ArrowRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils/cn";
import type { CoachingNudge } from "@/types/coaching";

interface NudgeToastProps {
  nudge: CoachingNudge;
  onDismiss: (id: string) => void;
  onAction?: (id: string, url: string) => void;
}

export function NudgeToast({ nudge, onDismiss, onAction }: NudgeToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => onDismiss(nudge.id), 300);
  }, [nudge.id, onDismiss]);

  // Auto-dismiss after 10 seconds for low priority
  useEffect(() => {
    if (nudge.priority === "low") {
      const timer = setTimeout(handleDismiss, 10000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [nudge.priority, handleDismiss]);

  return (
    <div
      className={cn(
        "pointer-events-auto w-full max-w-sm overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-elevated)] shadow-[var(--shadow-lg)] transition-all duration-300",
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-2 opacity-0"
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {nudge.title}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
              {nudge.body}
            </p>
            {nudge.actionUrl && nudge.actionLabel && (
              <button
                onClick={() => onAction?.(nudge.id, nudge.actionUrl!)}
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[var(--color-brand-600)] hover:text-[var(--color-brand-700)]"
              >
                {nudge.actionLabel}
                <ArrowRight size={12} />
              </button>
            )}
          </div>
          <button
            onClick={handleDismiss}
            className="shrink-0 rounded-[var(--radius-sm)] p-1 text-[var(--text-tertiary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]"
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
