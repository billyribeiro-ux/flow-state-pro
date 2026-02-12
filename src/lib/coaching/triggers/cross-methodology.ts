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
  {
    id: "cross.streak_broken",
    event: "analytics.streak_broken",
    methodology: "cross_methodology",
    condition: (ctx) => ctx.streakLongest >= 7,
    cooldown: "PT20H",
    priority: "high",
    channels: ["push", "in_app"],
    messageTemplate: (ctx) => ({
      title: "Streak Broken",
      body: `Your ${ctx.streakLongest}-day streak ended. It happens. What matters is starting again today. One session. That's all it takes to start a new streak.`,
      actionUrl: "/dashboard",
      actionLabel: "Start New Streak",
    }),
  },
  {
    id: "cross.pomodoro_to_deep_work",
    event: "session.completed",
    methodology: "cross_methodology",
    condition: (ctx, data) =>
      (data as { methodology: string }).methodology === "pomodoro" &&
      (data as { consecutivePomodoros: number }).consecutivePomodoros >= 4 &&
      !ctx.unlockedMethodologies.includes("deep_work"),
    cooldown: "P3D",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: () => ({
      title: "Ready for Deep Work? 🧠",
      body: "You just completed 4+ Pomodoros in a row. That's basically a deep work session. The Deep Work technique would help you structure these extended focus periods even better.",
      actionUrl: "/techniques/deep-work",
      actionLabel: "Explore Deep Work",
    }),
  },
  {
    id: "cross.eisenhower_meets_time_audit",
    event: "cron.weekly_review",
    methodology: "cross_methodology",
    condition: (ctx) =>
      ctx.unlockedMethodologies.includes("eisenhower") &&
      ctx.unlockedMethodologies.includes("time_audit"),
    cooldown: "P6D",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (_ctx, data) => ({
      title: "Eisenhower + Time Audit Insight",
      body: `Your time audit shows ${(data as { q3Percent: number }).q3Percent}% of time on Q3 (urgent, not important) tasks. That's time you could redirect to Q2 (important, not urgent) work. Delegate or eliminate Q3.`,
      actionUrl: "/techniques/eisenhower",
      actionLabel: "Review Matrix",
    }),
  },
  {
    id: "cross.frog_meets_pomodoro",
    event: "cron.morning_brief",
    methodology: "cross_methodology",
    condition: (ctx) =>
      ctx.unlockedMethodologies.includes("eat_the_frog") &&
      ctx.unlockedMethodologies.includes("pomodoro") &&
      ctx.frogStatus === "set",
    cooldown: "PT20H",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (ctx) => ({
      title: "Frog + Pomodoro Combo 🐸🍅",
      body: `Start your frog${ctx.frogTitle ? ` ("${ctx.frogTitle}")` : ""} with a Pomodoro. 25 minutes of focused frog-eating. If it's not done after one Pomodoro, do another. Break the frog into Pomodoro-sized bites.`,
      actionUrl: "/techniques/eat-the-frog",
      actionLabel: "Start Frog Pomodoro",
    }),
  },
  {
    id: "cross.time_audit_reveals_batching",
    event: "cron.weekly_review",
    methodology: "cross_methodology",
    condition: (ctx, data) =>
      ctx.unlockedMethodologies.includes("time_audit") &&
      (data as { contextSwitches: number }).contextSwitches > 20,
    cooldown: "P6D",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (_ctx, data) => ({
      title: "Time Audit → Batch Opportunity",
      body: `Your time audit shows ${(data as { contextSwitches: number }).contextSwitches} context switches this week. Batch Processing could cut that in half. Group similar tasks into dedicated sessions.`,
      actionUrl: "/techniques/batch",
      actionLabel: "Try Batching",
    }),
  },
  {
    id: "cross.gtd_meets_eisenhower",
    event: "task.created",
    methodology: "cross_methodology",
    condition: (ctx, data) =>
      ctx.unlockedMethodologies.includes("gtd") &&
      ctx.unlockedMethodologies.includes("eisenhower") &&
      (data as { gtdStatus: string }).gtdStatus === "inbox" &&
      !(data as { hasQuadrant: boolean }).hasQuadrant,
    cooldown: "PT4H",
    priority: "low",
    channels: ["in_app"],
    messageTemplate: () => ({
      title: "GTD + Eisenhower Tip",
      body: "When processing your GTD inbox, assign an Eisenhower quadrant to each item. This combines GTD's capture-everything approach with Eisenhower's prioritization power.",
      actionUrl: "/techniques/eisenhower",
      actionLabel: "Classify Tasks",
    }),
  },
  {
    id: "cross.pareto_meets_time_blocking",
    event: "cron.morning_brief",
    methodology: "cross_methodology",
    condition: (ctx) =>
      ctx.unlockedMethodologies.includes("pareto") &&
      ctx.unlockedMethodologies.includes("time_blocking"),
    cooldown: "P3D",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: () => ({
      title: "Pareto + Time Blocking",
      body: "Block your peak productivity hours for high-impact (top 20%) tasks only. Schedule low-impact work for your energy troughs. Let Pareto guide what goes where.",
      actionUrl: "/techniques/time-blocking",
      actionLabel: "Plan Blocks",
    }),
  },
];
