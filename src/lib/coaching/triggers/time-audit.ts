import type { CoachingTriggerDef } from "../types";

export const TIME_AUDIT_TRIGGERS: CoachingTriggerDef[] = [
  {
    id: "time_audit.daily_report",
    event: "cron.end_of_day",
    methodology: "time_audit",
    condition: () => true,
    cooldown: "PT20H",
    priority: "medium",
    channels: ["in_app", "push"],
    messageTemplate: (_ctx, data) => ({
      title: "Where Your Time Went Today",
      body: `Planned: ${(data as { plannedHours: number }).plannedHours}h focused work. Actual: ${(data as { actualHours: number }).actualHours}h. ${(data as { actualHours: number }).actualHours >= (data as { plannedHours: number }).plannedHours ? "You hit your target. 🎯" : "Gap detected. Let's figure out what pulled you off course."}`,
      actionUrl: "/techniques/time-audit",
      actionLabel: "View Report",
    }),
  },
  {
    id: "time_audit.weekly_insight",
    event: "cron.weekly_review",
    methodology: "time_audit",
    condition: () => true,
    cooldown: "P6D",
    priority: "high",
    channels: ["email", "in_app"],
    messageTemplate: (_ctx, data) => ({
      title: "Weekly Time Audit",
      body: `You think you spend ${(data as { perceivedDeepWork: number }).perceivedDeepWork}h on deep work. You actually spend ${(data as { actualDeepWork: number }).actualDeepWork}h. You can't manage what you don't measure.`,
      actionUrl: "/techniques/time-audit/reports",
      actionLabel: "Full Report",
    }),
  },
];
