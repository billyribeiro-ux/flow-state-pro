"use client";

import { useState } from "react";
import { Lightbulb, X } from "@phosphor-icons/react";

interface NudgeBannerProps {
  message: string;
  type?: "tip" | "reminder" | "encouragement";
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: { label: string; onClick: () => void };
}

export function NudgeBanner({
  message,
  type = "tip",
  dismissible = true,
  onDismiss,
  action,
}: NudgeBannerProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const colors = {
    tip: "border-[var(--color-brand-600)]/20 bg-[var(--color-brand-600)]/5",
    reminder: "border-[var(--color-warning)]/20 bg-[var(--color-warning)]/5",
    encouragement: "border-[var(--color-success)]/20 bg-[var(--color-success)]/5",
  };

  const iconColors = {
    tip: "text-[var(--color-brand-600)]",
    reminder: "text-[var(--color-warning)]",
    encouragement: "text-[var(--color-success)]",
  };

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  return (
    <div className={`flex items-center gap-3 rounded-[var(--radius-lg)] border p-3 ${colors[type]}`}>
      <Lightbulb size={16} weight="duotone" className={`shrink-0 ${iconColors[type]}`} />
      <p className="flex-1 text-sm text-[var(--text-primary)]">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="shrink-0 text-xs font-bold text-[var(--color-brand-600)] hover:underline"
        >
          {action.label}
        </button>
      )}
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="shrink-0 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
