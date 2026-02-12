import type { CoachingTriggerDef } from "../types";

export const TIME_BLOCKING_TRIGGERS: CoachingTriggerDef[] = [
  {
    id: "time_blocking.morning_schedule",
    event: "cron.morning_brief",
    methodology: "time_blocking",
    condition: () => true,
    cooldown: "PT20H",
    priority: "high",
    channels: ["push", "in_app"],
    messageTemplate: (_ctx, data) => {
      const blockCount = (data as { todayBlockCount: number }).todayBlockCount;
      return {
        title: "Today's Schedule",
        body: blockCount > 0
          ? `You have ${blockCount} time blocks today. First block starts soon. Review your schedule and prepare.`
          : "No time blocks set for today. If it's not on your calendar, it doesn't get done. Block your priorities now.",
        actionUrl: "/techniques/time-blocking",
        actionLabel: blockCount > 0 ? "View Schedule" : "Create Blocks",
      };
    },
  },
  {
    id: "time_blocking.upcoming_block",
    event: "cron.block_upcoming",
    methodology: "time_blocking",
    condition: () => true,
    cooldown: "PT20M",
    priority: "high",
    channels: ["push", "in_app"],
    messageTemplate: (_ctx, data) => ({
      title: "Block Starting in 5 Minutes",
      body: `Switching to: ${(data as { blockTitle: string }).blockTitle}. Wrap up what you're doing and prepare to transition.`,
      actionUrl: "/techniques/time-blocking",
      actionLabel: "View Block",
    }),
  },
  {
    id: "time_blocking.block_overrun",
    event: "time_block.overrun",
    methodology: "time_blocking",
    condition: (_ctx, data) =>
      (data as { overrunMinutes: number }).overrunMinutes > 15,
    cooldown: "PT30M",
    priority: "high",
    channels: ["push", "in_app"],
    messageTemplate: (_ctx, data) => ({
      title: "Block Overrun ⏰",
      body: `You're ${(data as { overrunMinutes: number }).overrunMinutes} minutes past your "${(data as { blockTitle: string }).blockTitle}" block. Move on or consciously extend? Lingering kills your schedule.`,
      actionUrl: "/techniques/time-blocking",
      actionLabel: "Adjust Schedule",
    }),
  },
  {
    id: "time_blocking.unblocked_gap",
    event: "cron.gap_detection",
    methodology: "time_blocking",
    condition: (_ctx, data) =>
      (data as { gapMinutes: number }).gapMinutes >= 30,
    cooldown: "PT2H",
    priority: "low",
    channels: ["in_app"],
    messageTemplate: (_ctx, data) => ({
      title: "Open Time Detected",
      body: `You have ${(data as { gapMinutes: number }).gapMinutes} unblocked minutes at ${(data as { gapStart: string }).gapStart}. Want to assign it to a task?`,
      actionUrl: "/techniques/time-blocking",
      actionLabel: "Fill Gap",
    }),
  },
];
