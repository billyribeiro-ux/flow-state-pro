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
];
