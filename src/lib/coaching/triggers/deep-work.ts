import type { CoachingTriggerDef } from "../types";

export const DEEP_WORK_TRIGGERS: CoachingTriggerDef[] = [
  {
    id: "deep_work.session_prep",
    event: "cron.deep_work_upcoming",
    methodology: "deep_work",
    condition: () => true,
    cooldown: "PT1H",
    priority: "high",
    channels: ["push", "in_app"],
    messageTemplate: () => ({
      title: "Deep Work in 10 Minutes 🧘",
      body: "Close Slack. Silence your phone. Clear your desk. Close unnecessary tabs. Your undivided attention is about to create something valuable.",
      actionUrl: "/techniques/deep-work",
      actionLabel: "Begin Session",
    }),
  },
  {
    id: "deep_work.distraction_spike",
    event: "deep_work.distraction_logged",
    methodology: "deep_work",
    condition: (_ctx, data) =>
      (data as { distractionCount: number }).distractionCount >= 3,
    cooldown: "PT30M",
    priority: "high",
    channels: ["in_app"],
    messageTemplate: (_ctx, data) => ({
      title: "Focus Drifting",
      body: `${(data as { distractionCount: number }).distractionCount} distractions so far. Each one costs you 23 minutes of recovery time. Recommit to the task. What's the ONE thing you need to finish?`,
    }),
  },
  {
    id: "deep_work.session_complete",
    event: "session.completed",
    methodology: "deep_work",
    condition: (_ctx, data) =>
      (data as { sessionType: string }).sessionType === "deep_work",
    cooldown: "PT1M",
    priority: "high",
    channels: ["push", "in_app"],
    messageTemplate: (_ctx, data) => {
      const mins = (data as { durationMinutes: number }).durationMinutes;
      const distractions = (data as { distractionCount: number }).distractionCount;
      return {
        title: "Deep Work Complete 💎",
        body: `${mins} minutes of deep work. ${distractions === 0 ? "Zero distractions — that's elite focus." : `${distractions} distraction${distractions === 1 ? "" : "s"} — awareness is the first step to fewer.`}`,
        actionUrl: "/techniques/deep-work",
        actionLabel: "Log Details",
      };
    },
  },
];
