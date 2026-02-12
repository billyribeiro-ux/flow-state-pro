import type { CoachingTriggerDef } from "../types";

export const CROSS_METHODOLOGY_TRIGGERS: CoachingTriggerDef[] = [
  {
    id: "cross.methodology_unlock",
    event: "methodology.unlock_ready",
    methodology: "cross_methodology",
    condition: () => true,
    cooldown: "P1D",
    priority: "critical",
    channels: ["push", "email", "in_app"],
    messageTemplate: (_ctx, data) => ({
      title: "New Technique Unlocked! 🔓",
      body: `You've mastered the basics of ${(data as { currentMethodology: string }).currentMethodology}. Ready for the next level? ${(data as { unlockedMethodology: string }).unlockedMethodology} is a natural next step and will amplify what you've already built.`,
      actionUrl: `/onboarding/${(data as { unlockedMethodologySlug: string }).unlockedMethodologySlug}`,
      actionLabel: "Explore",
    }),
  },
  {
    id: "cross.streak_at_risk",
    event: "cron.evening_check",
    methodology: "cross_methodology",
    condition: (ctx) =>
      ctx.streakCurrent >= 3 && ctx.todaysSessions === 0,
    cooldown: "PT20H",
    priority: "critical",
    channels: ["push", "in_app"],
    messageTemplate: (ctx) => ({
      title: `${ctx.streakCurrent}-Day Streak at Risk 🔥`,
      body: `You haven't logged a session today and your ${ctx.streakCurrent}-day streak is about to break. Even one Pomodoro or a 2-minute task burst keeps it alive.`,
      actionUrl: "/dashboard",
      actionLabel: "Quick Session",
    }),
  },
  {
    id: "cross.milestone_celebration",
    event: "analytics.milestone_reached",
    methodology: "cross_methodology",
    condition: () => true,
    cooldown: "PT1H",
    priority: "high",
    channels: ["push", "in_app"],
    messageTemplate: (_ctx, data) => ({
      title: `Milestone! ${(data as { milestone: string }).milestone} 🏆`,
      body: (data as { description: string }).description,
      actionUrl: "/analytics",
      actionLabel: "View Progress",
    }),
  },
];
