"use client";

import { CheckCircle, Circle, ArrowRight } from "@phosphor-icons/react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface ProgressTrackerProps {
  steps: OnboardingStep[];
  currentStepId?: string;
  onStepClick?: (stepId: string) => void;
  onComplete?: () => void;
}

export function ProgressTracker({
  steps,
  currentStepId,
  onStepClick,
  onComplete,
}: ProgressTrackerProps) {
  const completedCount = steps.filter((s) => s.completed).length;
  const progress = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;
  const allDone = completedCount === steps.length;

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Getting Started</h3>
          <p className="text-xs text-[var(--text-tertiary)]">
            {completedCount} of {steps.length} steps completed
          </p>
        </div>
        <span className="text-lg font-bold text-[var(--color-brand-600)]">{progress}%</span>
      </div>

      {/* Progress bar */}
      <div className="mb-6 h-2 w-full rounded-full bg-[var(--surface-secondary)]">
        <div
          className="h-2 rounded-full bg-[var(--color-brand-600)] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-1">
        {steps.map((step, i) => {
          const isCurrent = step.id === currentStepId;
          return (
            <button
              key={step.id}
              onClick={() => onStepClick?.(step.id)}
              className={`flex w-full items-center gap-3 rounded-[var(--radius-md)] p-3 text-left transition-colors ${
                isCurrent
                  ? "bg-[var(--color-brand-600)]/5 ring-1 ring-[var(--color-brand-600)]/20"
                  : "hover:bg-[var(--surface-secondary)]"
              }`}
            >
              {step.completed ? (
                <CheckCircle size={20} weight="fill" className="shrink-0 text-[var(--color-success)]" />
              ) : (
                <Circle
                  size={20}
                  className={`shrink-0 ${isCurrent ? "text-[var(--color-brand-600)]" : "text-[var(--text-tertiary)]"}`}
                />
              )}

              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm font-medium ${
                    step.completed
                      ? "text-[var(--text-tertiary)] line-through"
                      : "text-[var(--text-primary)]"
                  }`}
                >
                  {step.title}
                </p>
                {isCurrent && !step.completed && (
                  <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{step.description}</p>
                )}
              </div>

              {isCurrent && !step.completed && (
                <ArrowRight size={14} className="shrink-0 text-[var(--color-brand-600)]" />
              )}
            </button>
          );
        })}
      </div>

      {allDone && onComplete && (
        <button
          onClick={onComplete}
          className="mt-4 w-full rounded-[var(--radius-md)] bg-[var(--color-brand-600)] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-brand-700)]"
        >
          Complete Onboarding
        </button>
      )}
    </div>
  );
}
