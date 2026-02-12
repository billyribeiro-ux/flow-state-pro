import type { Metadata } from "next";
import { getDbUser } from "@/lib/auth/clerk";
import { getTodayFocusMinutes, getTodaySessionCount } from "@/lib/db/queries/sessions";
import { getCompletedTaskCount, getTasksByUser } from "@/lib/db/queries/tasks";
import { getActiveSession } from "@/lib/db/queries/sessions";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const user = await getDbUser();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [focusMinutes, sessionCount, tasksCompleted, activeSession, recentTasks] =
    await Promise.all([
      getTodayFocusMinutes(user.id),
      getTodaySessionCount(user.id),
      getCompletedTaskCount(user.id, today),
      getActiveSession(user.id),
      getTasksByUser(user.id, { limit: 5 }),
    ]);

  const streakDays = user.currentStreak ?? 0;

  const stats = [
    { label: "Focus Today", value: `${focusMinutes}m`, color: "var(--color-brand-600)" },
    { label: "Sessions", value: String(sessionCount), color: "var(--color-pomodoro)" },
    { label: "Tasks Done", value: String(tasksCompleted), color: "var(--color-success)" },
    { label: "Streak", value: `${streakDays} days`, color: "var(--color-warning)" },
  ];

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
        {stats.map((stat) => (
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

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Session / Technique */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6 shadow-[var(--shadow-xs)]">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            {activeSession ? "Active Session" : "Active Technique"}
          </h2>
          {activeSession ? (
            <div className="mt-3 space-y-2">
              <p className="text-sm text-[var(--text-secondary)]">
                <span className="font-medium text-[var(--text-primary)]">{activeSession.methodology}</span>
                {" "}session in progress
              </p>
              <p className="text-xs text-[var(--text-tertiary)]">
                Status: <span className="font-medium capitalize">{activeSession.status}</span>
              </p>
              <Link
                href="/techniques/pomodoro"
                className="mt-2 inline-block rounded-[var(--radius-md)] bg-[var(--color-brand-600)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--color-brand-700)]"
              >
                Go to Session
              </Link>
            </div>
          ) : user.activeMethodology ? (
            <div className="mt-3">
              <p className="text-sm text-[var(--text-secondary)]">
                Current methodology:{" "}
                <span className="font-medium capitalize text-[var(--text-primary)]">
                  {user.activeMethodology}
                </span>
              </p>
              <Link
                href={`/techniques/${user.activeMethodology}`}
                className="mt-3 inline-block rounded-[var(--radius-md)] bg-[var(--color-brand-600)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--color-brand-700)]"
              >
                Start Session
              </Link>
            </div>
          ) : (
            <p className="mt-2 text-sm text-[var(--text-tertiary)]">
              Complete onboarding to select your first methodology.
            </p>
          )}
        </div>

        {/* Recent Tasks */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6 shadow-[var(--shadow-xs)]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Recent Tasks
            </h2>
            <Link href="/tasks" className="text-xs font-medium text-[var(--color-brand-600)] hover:underline">
              View all
            </Link>
          </div>
          {recentTasks.length === 0 ? (
            <p className="mt-2 text-sm text-[var(--text-tertiary)]">
              No tasks yet. Create your first task to get started.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {recentTasks.map((task) => (
                <li key={task.id} className="flex items-center gap-3">
                  <div
                    className={`h-2 w-2 shrink-0 rounded-full ${task.status === "completed"
                        ? "bg-[var(--color-success)]"
                        : "bg-[var(--text-tertiary)]"
                      }`}
                  />
                  <span
                    className={`flex-1 truncate text-sm ${task.status === "completed"
                        ? "text-[var(--text-tertiary)] line-through"
                        : "text-[var(--text-primary)]"
                      }`}
                  >
                    {task.title}
                  </span>
                  <span className="text-[10px] capitalize text-[var(--text-tertiary)]">
                    {task.priority}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
