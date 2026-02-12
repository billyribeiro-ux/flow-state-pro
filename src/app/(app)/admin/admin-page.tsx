"use client";

import { Users, ChartBar, Database, Gear, ShieldCheck } from "@phosphor-icons/react";

export function AdminPage() {
  const stats = [
    { label: "Total Users", value: "—", icon: Users },
    { label: "Active Today", value: "—", icon: ChartBar },
    { label: "Total Sessions", value: "—", icon: Database },
    { label: "System Health", value: "OK", icon: Gear },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShieldCheck size={24} weight="duotone" className="text-[var(--color-brand-600)]" />
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            System overview and user management
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[var(--text-tertiary)]">{stat.label}</span>
                <Icon size={16} className="text-[var(--text-tertiary)]" />
              </div>
              <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* User Management */}
      <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">User Management</h3>
        <div className="mt-4 flex h-48 items-center justify-center">
          <p className="text-sm text-[var(--text-tertiary)]">
            Connect to database to view users
          </p>
        </div>
      </div>

      {/* System Logs */}
      <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Recent Activity</h3>
        <div className="mt-4 flex h-32 items-center justify-center">
          <p className="text-sm text-[var(--text-tertiary)]">
            No recent activity to display
          </p>
        </div>
      </div>
    </div>
  );
}
