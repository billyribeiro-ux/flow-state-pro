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
  {
    id: "time_audit.start_tracking",
    event: "cron.morning_brief",
    methodology: "time_audit",
    condition: () => true,
    cooldown: "PT20H",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: () => ({
      title: "Start Tracking Your Day ⏱️",
      body: "New day, new data. Start your time tracker now. Every hour you don't track is an hour you can't analyze or improve.",
      actionUrl: "/techniques/time-audit",
      actionLabel: "Start Tracking",
    }),
  },
  {
    id: "time_audit.tracking_gap",
    event: "cron.midday_check",
    methodology: "time_audit",
    condition: (_ctx, data) =>
      (data as { untracked_minutes: number }).untracked_minutes > 60,
    cooldown: "PT4H",
    priority: "high",
    channels: ["in_app", "push"],
    messageTemplate: (_ctx, data) => ({
      title: "Tracking Gap Detected",
      body: `${Math.round((data as { untracked_minutes: number }).untracked_minutes / 60)} hours untracked today. Fill in the gaps now while you still remember. Untracked time = invisible time.`,
      actionUrl: "/techniques/time-audit",
      actionLabel: "Fill Gaps",
    }),
  },
  {
    id: "time_audit.perception_vs_reality",
    event: "cron.end_of_day",
    methodology: "time_audit",
    condition: (_ctx, data) => {
      const gap = Math.abs(
        (data as { perceivedProductiveHours: number }).perceivedProductiveHours -
        (data as { actualProductiveHours: number }).actualProductiveHours
      );
      return gap >= 1.5;
    },
    cooldown: "PT20H",
    priority: "high",
    channels: ["in_app"],
    messageTemplate: (_ctx, data) => ({
      title: "Perception vs Reality Gap",
      body: `You felt like you worked ${(data as { perceivedProductiveHours: number }).perceivedProductiveHours}h productively. The data says ${(data as { actualProductiveHours: number }).actualProductiveHours}h. That ${Math.abs((data as { perceivedProductiveHours: number }).perceivedProductiveHours - (data as { actualProductiveHours: number }).actualProductiveHours).toFixed(1)}h gap is where improvement hides.`,
      actionUrl: "/techniques/time-audit",
      actionLabel: "Analyze Gap",
    }),
  },
  {
    id: "time_audit.category_alert",
    event: "time_audit.activity_check",
    methodology: "time_audit",
    condition: (_ctx, data) =>
      (data as { categoryOverBudget: boolean }).categoryOverBudget === true,
    cooldown: "PT4H",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (_ctx, data) => ({
      title: "Category Over Budget",
      body: `You've spent ${(data as { actualMinutes: number }).actualMinutes} minutes on "${(data as { category: string }).category}" today — ${(data as { overByMinutes: number }).overByMinutes} minutes over your target. Time to switch focus.`,
      actionUrl: "/techniques/time-audit",
      actionLabel: "View Breakdown",
    }),
  },
  {
    id: "time_audit.heatmap_insight",
    event: "cron.weekly_review",
    methodology: "time_audit",
    condition: () => true,
    cooldown: "P6D",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (_ctx, data) => ({
      title: "Your Productivity Heatmap 🗓️",
      body: `Your most productive hours: ${(data as { peakHours: string }).peakHours}. Your least productive: ${(data as { troughHours: string }).troughHours}. Schedule your hardest work during peak hours.`,
      actionUrl: "/techniques/time-audit/reports",
      actionLabel: "View Heatmap",
    }),
  },
  {
    id: "time_audit.unproductive_pattern",
    event: "cron.weekly_review",
    methodology: "time_audit",
    condition: (_ctx, data) =>
      (data as { unproductivePercent: number }).unproductivePercent > 30,
    cooldown: "P6D",
    priority: "high",
    channels: ["in_app"],
    messageTemplate: (_ctx, data) => ({
      title: "Unproductive Time Pattern",
      body: `${(data as { unproductivePercent: number }).unproductivePercent}% of your tracked time this week was unproductive. Top culprit: "${(data as { topCulprit: string }).topCulprit}" at ${(data as { culpritMinutes: number }).culpritMinutes} minutes. Can you reduce or eliminate it?`,
      actionUrl: "/techniques/time-audit/reports",
      actionLabel: "View Analysis",
    }),
  },
];
