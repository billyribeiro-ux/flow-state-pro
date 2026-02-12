"use client";

import { Brain } from "@phosphor-icons/react";

interface FocusMeterProps {
  level: number; // 0-100
  label?: string;
}

export function FocusMeter({ level, label = "Focus Level" }: FocusMeterProps) {
  const getColor = () => {
    if (level >= 80) return "var(--color-success)";
    if (level >= 50) return "var(--methodology-deep-work)";
    if (level >= 25) return "var(--color-warning)";
    return "var(--color-error)";
  };

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
      <div className="mb-4 flex items-center gap-2">
        <Brain size={18} weight="duotone" className="text-[var(--methodology-deep-work)]" />
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">{label}</h3>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-32 w-32 items-center justify-center">
          <svg className="h-32 w-32 -rotate-90" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r="56" fill="none" stroke="var(--surface-secondary)" strokeWidth="8" />
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke={getColor()}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(level / 100) * 351.86} 351.86`}
            />
          </svg>
          <span className="absolute text-2xl font-bold text-[var(--text-primary)]">{level}%</span>
        </div>
        <p className="text-xs text-[var(--text-tertiary)]">
          {level >= 80
            ? "Deep flow state achieved"
            : level >= 50
              ? "Good focus — keep going"
              : level >= 25
                ? "Building momentum"
                : "Warming up"}
        </p>
      </div>
    </div>
  );
}
