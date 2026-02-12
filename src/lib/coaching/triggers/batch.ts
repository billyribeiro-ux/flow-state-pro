import type { CoachingTriggerDef } from "../types";

export const BATCH_TRIGGERS: CoachingTriggerDef[] = [
  {
    id: "batch.pattern_detected",
    event: "task.created",
    methodology: "batch",
    condition: (_ctx, data) =>
      (data as { sameCategoryCount: number }).sameCategoryCount >= 3,
    cooldown: "PT2H",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (_ctx, data) => ({
      title: "Batch Opportunity 📦",
      body: `You have ${(data as { sameCategoryCount: number }).sameCategoryCount} ${(data as { category: string }).category} tasks. Batching them into one session could save you ${Math.round((data as { sameCategoryCount: number }).sameCategoryCount * 8)} minutes of context switching.`,
      actionUrl: "/techniques/batch",
      actionLabel: "Create Batch",
    }),
  },
  {
    id: "batch.session_complete",
    event: "session.completed",
    methodology: "batch",
    condition: (_ctx, data) =>
      (data as { sessionType: string }).sessionType === "batch",
    cooldown: "PT1M",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (_ctx, data) => ({
      title: "Batch Complete ✅",
      body: `${(data as { tasksCompleted: number }).tasksCompleted} tasks knocked out in one session. That would've taken 2x longer spread across your day.`,
      actionUrl: "/techniques/batch",
      actionLabel: "View Summary",
    }),
  },
];
