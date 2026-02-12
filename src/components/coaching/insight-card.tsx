"use client";

import { TrendUp, TrendDown, Minus, Sparkle } from "@phosphor-icons/react";

type Trend = "up" | "down" | "neutral";

interface InsightCardProps {
  title: string;
  description: string;
  metric?: string;
  trend?: Trend;
  category?: string;
}

export function InsightCard({
  title,
  description,
  metric,
  trend = "neutral",
  category,
}: InsightCardProps) {
  const trendIcons = { up: TrendUp, down: TrendDown, neutral: Minus };
  const trendColors = {
    up: "text-[var(--color-success)]",
    down: "text-[var(--color-error)]",
    neutral: "text-[var(--text-tertiary)]",
  };
  const TrendIcon = trendIcons[trend];

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkle size={14} weight="fill" className="text-[var(--color-brand-500)]" />
          {category && (
            <span className="rounded-full bg-[var(--surface-secondary)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-tertiary)]">
              {category}
            </span>
          )}
        </div>
        {metric && (
          <div className="flex items-center gap-1">
            <TrendIcon size={12} className={trendColors[trend]} />
            <span className={`text-sm font-bold ${trendColors[trend]}`}>{metric}</span>
          </div>
        )}
      </div>

      <h4 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h4>
      <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">{description}</p>
    </div>
  );
}
