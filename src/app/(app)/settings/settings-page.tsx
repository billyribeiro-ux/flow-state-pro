"use client";

import { useState } from "react";
import { User, Bell, Timer, Robot, Palette, Shield } from "@phosphor-icons/react";

type SettingsTab = "profile" | "notifications" | "timer" | "coaching" | "appearance" | "privacy";

const TABS: { key: SettingsTab; label: string; icon: React.ElementType }[] = [
  { key: "profile", label: "Profile", icon: User },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "timer", label: "Timer", icon: Timer },
  { key: "coaching", label: "Coaching", icon: Robot },
  { key: "appearance", label: "Appearance", icon: Palette },
  { key: "privacy", label: "Privacy", icon: Shield },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Manage your account and preferences
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <nav className="w-48 shrink-0 space-y-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex w-full items-center gap-2.5 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-[var(--color-brand-600)] text-white"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <div className="min-w-0 flex-1 rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "notifications" && <NotificationSettings />}
          {activeTab === "timer" && <TimerSettings />}
          {activeTab === "coaching" && <CoachingSettings />}
          {activeTab === "appearance" && <AppearanceSettings />}
          {activeTab === "privacy" && <PrivacySettings />}
        </div>
      </div>
    </div>
  );
}

function ProfileSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">First Name</label>
          <input type="text" className="w-full rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-secondary)] px-3 py-2 text-sm text-[var(--text-primary)]" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">Last Name</label>
          <input type="text" className="w-full rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-secondary)] px-3 py-2 text-sm text-[var(--text-primary)]" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">Timezone</label>
          <select className="w-full rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-secondary)] px-3 py-2 text-sm text-[var(--text-primary)]">
            <option>Auto-detect</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">Notifications</h2>
      <div className="space-y-4">
        {[
          { label: "Push Notifications", description: "Browser push notifications for timers and reminders" },
          { label: "Email Digest", description: "Daily or weekly email summaries" },
          { label: "Session Reminders", description: "Reminders to start focus sessions" },
          { label: "Streak Alerts", description: "Alerts when your streak is at risk" },
          { label: "Coaching Nudges", description: "AI coach suggestions and tips" },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--border-subtle)] p-4">
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">{item.label}</p>
              <p className="text-xs text-[var(--text-tertiary)]">{item.description}</p>
            </div>
            <div className="h-6 w-10 rounded-full bg-[var(--surface-tertiary)]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function TimerSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">Timer</h2>
      <div className="space-y-4">
        {[
          { label: "Pomodoro Duration", value: "25 min" },
          { label: "Short Break", value: "5 min" },
          { label: "Long Break", value: "15 min" },
          { label: "Pomodoros per Set", value: "4" },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--border-subtle)] p-4">
            <p className="text-sm font-medium text-[var(--text-primary)]">{item.label}</p>
            <span className="text-sm text-[var(--text-secondary)]">{item.value}</span>
          </div>
        ))}
        <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--border-subtle)] p-4">
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Auto-start Breaks</p>
            <p className="text-xs text-[var(--text-tertiary)]">Automatically start break timer after focus session</p>
          </div>
          <div className="h-6 w-10 rounded-full bg-[var(--surface-tertiary)]" />
        </div>
        <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--border-subtle)] p-4">
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Sound Enabled</p>
            <p className="text-xs text-[var(--text-tertiary)]">Play sound when timer completes</p>
          </div>
          <div className="h-6 w-10 rounded-full bg-[var(--color-brand-600)]" />
        </div>
      </div>
    </div>
  );
}

function CoachingSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">Coaching Preferences</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--border-subtle)] p-4">
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Morning Brief</p>
            <p className="text-xs text-[var(--text-tertiary)]">Daily morning productivity brief from your AI coach</p>
          </div>
          <div className="h-6 w-10 rounded-full bg-[var(--color-brand-600)]" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">Nudge Frequency</label>
          <select className="w-full rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-secondary)] px-3 py-2 text-sm text-[var(--text-primary)]">
            <option>Medium</option>
            <option>Low</option>
            <option>High</option>
            <option>Off</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">Coaching Tone</label>
          <select className="w-full rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-secondary)] px-3 py-2 text-sm text-[var(--text-primary)]">
            <option>Encouraging</option>
            <option>Direct</option>
            <option>Analytical</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function AppearanceSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">Appearance</h2>
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">Theme</label>
          <div className="flex gap-3">
            {["Light", "Dark", "System"].map((theme) => (
              <button
                key={theme}
                className={`rounded-[var(--radius-md)] border px-4 py-2 text-sm font-medium ${
                  theme === "Dark"
                    ? "border-[var(--color-brand-600)] bg-[var(--color-brand-600)]/10 text-[var(--color-brand-600)]"
                    : "border-[var(--border-subtle)] text-[var(--text-secondary)]"
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--border-subtle)] p-4">
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Reduced Motion</p>
            <p className="text-xs text-[var(--text-tertiary)]">Minimize animations and transitions</p>
          </div>
          <div className="h-6 w-10 rounded-full bg-[var(--surface-tertiary)]" />
        </div>
      </div>
    </div>
  );
}

function PrivacySettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">Privacy & Data</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--border-subtle)] p-4">
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Analytics</p>
            <p className="text-xs text-[var(--text-tertiary)]">Help us improve by sharing anonymous usage data</p>
          </div>
          <div className="h-6 w-10 rounded-full bg-[var(--color-brand-600)]" />
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] p-4">
          <p className="text-sm font-medium text-[var(--text-primary)]">Export Data</p>
          <p className="mt-1 text-xs text-[var(--text-tertiary)]">Download all your data in JSON format</p>
          <button className="mt-3 rounded-[var(--radius-md)] border border-[var(--border-subtle)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            Export
          </button>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--color-error)]/30 bg-[var(--color-error)]/5 p-4">
          <p className="text-sm font-medium text-[var(--color-error)]">Danger Zone</p>
          <p className="mt-1 text-xs text-[var(--text-tertiary)]">Permanently delete your account and all data</p>
          <button className="mt-3 rounded-[var(--radius-md)] bg-[var(--color-error)] px-3 py-1.5 text-xs font-medium text-white">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
