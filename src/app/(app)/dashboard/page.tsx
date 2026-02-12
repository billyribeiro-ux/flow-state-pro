import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Your productivity command center
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Focus Today", value: "0m", color: "var(--color-brand-600)" },
          { label: "Sessions", value: "0", color: "var(--color-pomodoro)" },
          { label: "Tasks Done", value: "0", color: "var(--color-success)" },
          { label: "Streak", value: "0 days", color: "var(--color-warning)" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-4 shadow-[var(--shadow-xs)]"
          >
            <p className="text-xs font-medium text-[var(--text-tertiary)]">
              {stat.label}
            </p>
            <p
              className="mt-1 text-2xl font-bold"
              style={{ color: stat.color }}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Placeholder sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6 shadow-[var(--shadow-xs)]">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Active Technique
          </h2>
          <p className="mt-2 text-sm text-[var(--text-tertiary)]">
            Complete onboarding to select your first methodology.
          </p>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6 shadow-[var(--shadow-xs)]">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            AI Coach
          </h2>
          <p className="mt-2 text-sm text-[var(--text-tertiary)]">
            Your daily briefing will appear here once you start using FlowState.
          </p>
        </div>
      </div>
    </div>
  );
}
