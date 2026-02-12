import type { CoachingTriggerDef } from "../types";

export const PARETO_TRIGGERS: CoachingTriggerDef[] = [
  {
    id: "pareto.weekly_analysis",
    event: "cron.friday_analysis",
    methodology: "pareto",
    condition: () => true,
    cooldown: "P6D",
    priority: "high",
    channels: ["push", "email", "in_app"],
    messageTemplate: (_ctx, data) => ({
      title: "Your 80/20 Report 📊",
      body: `This week, ${(data as { topActivitiesCount: number }).topActivitiesCount} activities generated 80% of your results. ${(data as { bottomActivitiesCount: number }).bottomActivitiesCount} activities barely moved the needle. Time to double down on what works.`,
      actionUrl: "/techniques/pareto",
      actionLabel: "View Analysis",
    }),
  },
  {
    id: "pareto.low_impact_warning",
    event: "time_audit.activity_check",
    methodology: "pareto",
    condition: (_ctx, data) =>
      (data as { lowImpactMinutes: number }).lowImpactMinutes > 180,
    cooldown: "PT6H",
    priority: "high",
    channels: ["in_app"],
    messageTemplate: (_ctx, data) => ({
      title: "Low-Impact Alert",
      body: `You've spent ${Math.round((data as { lowImpactMinutes: number }).lowImpactMinutes / 60)} hours on low-impact tasks today. Is this the best use of your time? Check your high-impact activities.`,
      actionUrl: "/techniques/pareto",
      actionLabel: "Reprioritize",
    }),
  },
  {
    id: "pareto.high_impact_streak",
    event: "task.completed",
    methodology: "pareto",
    condition: (_ctx, data) =>
      (data as { paretoCategory: string }).paretoCategory === "high_impact" &&
      (data as { consecutiveHighImpact: number }).consecutiveHighImpact >= 3,
    cooldown: "PT2H",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (_ctx, data) => ({
      title: "High-Impact Streak! 🎯",
      body: `${(data as { consecutiveHighImpact: number }).consecutiveHighImpact} high-impact tasks in a row. You're in the 20% zone — this is where the real results come from. Keep going.`,
      actionUrl: "/techniques/pareto",
      actionLabel: "Continue",
    }),
  },
  {
    id: "pareto.impact_tagging_reminder",
    event: "task.created",
    methodology: "pareto",
    condition: (_ctx, data) =>
      !(data as { hasImpactScore: boolean }).hasImpactScore,
    cooldown: "PT4H",
    priority: "low",
    channels: ["in_app"],
    messageTemplate: (_ctx, data) => ({
      title: "Tag Your Impact",
      body: `"${(data as { title: string }).title}" needs an impact score. Is this high-impact (moves the needle) or low-impact (busywork)? Tagging helps you see your 80/20 split.`,
      actionUrl: "/techniques/pareto",
      actionLabel: "Score Task",
    }),
  },
  {
    id: "pareto.monthly_trend",
    event: "cron.monthly_review",
    methodology: "pareto",
    condition: () => true,
    cooldown: "P27D",
    priority: "high",
    channels: ["email", "in_app"],
    messageTemplate: (_ctx, data) => ({
      title: "Monthly Pareto Trend 📈",
      body: `This month: ${(data as { highImpactPercent: number }).highImpactPercent}% of your time on high-impact work (target: 80%). ${(data as { highImpactPercent: number }).highImpactPercent >= 70 ? "You're close to optimal." : "There's room to cut more low-impact work."}`,
      actionUrl: "/techniques/pareto",
      actionLabel: "View Trend",
    }),
  },
  {
    id: "pareto.task_started_low_impact",
    event: "task.started",
    methodology: "pareto",
    condition: (_ctx, data) =>
      (data as { paretoCategory: string }).paretoCategory === "low_impact" &&
      (data as { highImpactAvailable: number }).highImpactAvailable > 0,
    cooldown: "PT2H",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (_ctx, data) => ({
      title: "Low-Impact Task Started",
      body: `You're starting a low-impact task while ${(data as { highImpactAvailable: number }).highImpactAvailable} high-impact tasks are waiting. Is this intentional? The 80/20 rule says your high-impact work should come first.`,
      actionUrl: "/techniques/pareto",
      actionLabel: "Switch Task",
    }),
  },
];
