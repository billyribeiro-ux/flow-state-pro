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
  {
    id: "two_minute.cleared_celebration",
    event: "task.completed",
    methodology: "two_minute",
    condition: (_ctx, data) =>
      (data as { isTwoMinute: boolean }).isTwoMinute &&
      (data as { remainingTwoMinute: number }).remainingTwoMinute === 0,
    cooldown: "PT1M",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (_ctx, data) => ({
      title: "Two-Minute Queue Cleared! ⚡✨",
      body: `All ${(data as { clearedCount: number }).clearedCount} quick tasks done. Your system is clean. Zero mental overhead from small stuff. Now go do something big.`,
      actionUrl: "/dashboard",
      actionLabel: "Next Task",
    }),
  },
  {
    id: "two_minute.morning_scan",
    event: "cron.morning_brief",
    methodology: "two_minute",
    condition: (_ctx, data) =>
      (data as { twoMinuteCount: number }).twoMinuteCount >= 2,
    cooldown: "PT20H",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (_ctx, data) => ({
      title: "Morning Quick Wins ⚡",
      body: `${(data as { twoMinuteCount: number }).twoMinuteCount} two-minute tasks waiting. Clear them first as a warm-up — it'll take under ${(data as { twoMinuteCount: number }).twoMinuteCount * 2} minutes and you'll start the day with momentum.`,
      actionUrl: "/techniques/two-minute",
      actionLabel: "Clear Queue",
    }),
  },
  {
    id: "two_minute.weekly_stats",
    event: "cron.weekly_review",
    methodology: "two_minute",
    condition: () => true,
    cooldown: "P6D",
    priority: "low",
    channels: ["in_app"],
    messageTemplate: (_ctx, data) => ({
      title: "Two-Minute Rule Weekly Stats",
      body: `This week: ${(data as { cleared: number }).cleared} quick tasks cleared, ${(data as { deferred: number }).deferred} deferred. ${(data as { deferred: number }).deferred > (data as { cleared: number }).cleared ? "You're deferring more than clearing — try the 'do it now' habit." : "Great ratio. You're keeping your system clean."}`,
      actionUrl: "/techniques/two-minute",
      actionLabel: "View Stats",
    }),
  },
];
