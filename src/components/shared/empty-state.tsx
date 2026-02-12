"use client";

import { Ghost } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      {icon ?? <Ghost size={48} weight="duotone" className="text-[var(--text-tertiary)]" />}
      <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
      {description && (
        <p className="max-w-xs text-xs leading-relaxed text-[var(--text-secondary)]">{description}</p>
      )}
      {action && (
        <Button size="sm" onClick={action.onClick} className="mt-2">
          {action.label}
        </Button>
      )}
    </div>
  );
}
