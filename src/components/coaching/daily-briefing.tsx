"use client";

import { Sun, Target, Lightning, ArrowRight } from "@phosphor-icons/react";

interface DailyBriefingProps {
  greeting?: string;
  focusGoal?: string;
  suggestedTechnique?: string;
  streakDays?: number;
  onStartSession?: () => void;
}

export function DailyBriefing({
  greeting = "Good morning!",
  focusGoal = "No goal set for today",
  suggestedTechnique,
  streakDays = 0,
  onStartSession,
}: DailyBriefingProps) {
  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-gradient-to-br from-[var(--color-brand-600)]/10 to-transparent p-6">
      <div className="mb-4 flex items-center gap-2">
        <Sun size={20} weight="duotone" className="text-[var(--color-warning)]" />
        <h3 className="text-lg font-bold text-[var(--text-primary)]">{greeting}</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Target size={16} className="mt-0.5 shrink-0 text-[var(--color-brand-600)]" />
          <div>
            <p className="text-xs font-medium text-[var(--text-tertiary)]">Today&apos;s Focus</p>
            <p className="text-sm font-medium text-[var(--text-primary)]">{focusGoal}</p>
          </div>
        </div>

        {suggestedTechnique && (
          <div className="flex items-start gap-3">
            <Lightning size={16} className="mt-0.5 shrink-0 text-[var(--color-brand-600)]" />
            <div>
              <p className="text-xs font-medium text-[var(--text-tertiary)]">Suggested Technique</p>
              <p className="text-sm font-medium text-[var(--text-primary)]">{suggestedTechnique}</p>
            </div>
          </div>
        )}

        {streakDays > 0 && (
          <p className="text-xs text-[var(--text-secondary)]">
            You&apos;re on a <span className="font-bold text-[var(--color-brand-600)]">{streakDays}-day</span> streak!
          </p>
        )}
      </div>

      {onStartSession && (
        <button
          onClick={onStartSession}
          className="mt-4 flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-brand-600)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-brand-700)]"
        >
          Start Focus Session
          <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
}
