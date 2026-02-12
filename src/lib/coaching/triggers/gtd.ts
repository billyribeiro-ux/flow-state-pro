import type { CoachingTriggerDef } from "../types";

export const GTD_TRIGGERS: CoachingTriggerDef[] = [
  {
    id: "gtd.capture_reminder",
    event: "cron.capture_time",
    methodology: "gtd",
    condition: () => true,
    cooldown: "PT8H",
    priority: "medium",
    channels: ["push", "in_app"],
    messageTemplate: () => ({
      title: "Brain Dump Time 🧠",
      body: "What's floating in your head right now? Get it out of your brain and into your inbox. 2 minutes.",
      actionUrl: "/techniques/gtd/inbox",
      actionLabel: "Open Inbox",
    }),
  },
  {
    id: "gtd.inbox_pileup",
    event: "cron.inbox_check",
    methodology: "gtd",
    condition: (ctx) => ctx.unprocessedInboxItems > 5,
    cooldown: "PT6H",
    priority: "high",
    channels: ["push", "in_app"],
    messageTemplate: (ctx) => ({
      title: "Inbox Needs Attention",
      body: `You have ${ctx.unprocessedInboxItems} unprocessed items. Your inbox is a collection point, not a storage unit. Let's clarify them.`,
      actionUrl: "/techniques/gtd/inbox",
      actionLabel: "Process Inbox",
    }),
  },
  {
    id: "gtd.weekly_review",
    event: "cron.weekly_review",
    methodology: "gtd",
    condition: () => true,
    cooldown: "P6D",
    priority: "critical",
    channels: ["push", "email", "in_app"],
    messageTemplate: () => ({
      title: "Weekly Review Time 📋",
      body: "The weekly review is the engine of GTD. Clear your inbox, review your projects, update your next actions. 30 minutes that save you hours.",
      actionUrl: "/techniques/gtd/review",
      actionLabel: "Start Review",
    }),
  },
  {
    id: "gtd.stale_project",
    event: "cron.daily_check",
    methodology: "gtd",
    condition: (_ctx, data) =>
      (data as { staleProjectCount: number }).staleProjectCount > 0,
    cooldown: "P3D",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (_ctx, data) => ({
      title: "Stale Projects Detected",
      body: `${(data as { staleProjectCount: number }).staleProjectCount} project(s) have no next action defined. A project without a next action is dead. Let's fix that.`,
      actionUrl: "/techniques/gtd/projects",
      actionLabel: "Review Projects",
    }),
  },
];
