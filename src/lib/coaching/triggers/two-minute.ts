import type { CoachingTriggerDef } from "../types";

export const TWO_MINUTE_TRIGGERS: CoachingTriggerDef[] = [
  {
    id: "two_minute.task_flagged",
    event: "task.created",
    methodology: "two_minute",
    condition: (_ctx, data) =>
      ((data as { estimatedMinutes: number }).estimatedMinutes ?? 999) <= 2,
    cooldown: "PT5M",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (_ctx, data) => ({
      title: "Two-Minute Task Detected ⚡",
      body: `"${(data as { title: string }).title}" looks like a 2-minute task. Do it now instead of adding it to your list. The overhead of tracking it costs more than just doing it.`,
      actionUrl: "/techniques/two-minute",
      actionLabel: "Do It Now",
    }),
  },
  {
    id: "two_minute.batch_available",
    event: "cron.two_minute_scan",
    methodology: "two_minute",
    condition: (_ctx, data) =>
      (data as { twoMinuteCount: number }).twoMinuteCount >= 3,
    cooldown: "PT4H",
    priority: "medium",
    channels: ["push", "in_app"],
    messageTemplate: (_ctx, data) => ({
      title: "Quick Wins Available",
      body: `You have ${(data as { twoMinuteCount: number }).twoMinuteCount} tasks under 2 minutes. Knock them all out in one burst — should take about ${(data as { twoMinuteCount: number }).twoMinuteCount * 2} minutes.`,
      actionUrl: "/techniques/two-minute",
      actionLabel: "Clear Queue",
    }),
  },
  {
    id: "two_minute.deferred_warning",
    event: "task.deferred",
    methodology: "two_minute",
    condition: (_ctx, data) =>
      (data as { isTwoMinute: boolean }).isTwoMinute &&
      (data as { deferCount: number }).deferCount >= 3,
    cooldown: "PT8H",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (_ctx, data) => ({
      title: "Just Do It Already",
      body: `You've deferred "${(data as { title: string }).title}" ${(data as { deferCount: number }).deferCount} times. It takes 2 minutes. The mental overhead of seeing it repeatedly is costing you more. Do it now.`,
      actionUrl: "/techniques/two-minute",
      actionLabel: "Do It Now",
    }),
  },
];
