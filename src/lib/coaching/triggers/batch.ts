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
  {
    id: "batch.session_started",
    event: "session.started",
    methodology: "batch",
    condition: (_ctx, data) =>
      (data as { sessionType: string }).sessionType === "batch",
    cooldown: "PT1M",
    priority: "low",
    channels: ["in_app"],
    messageTemplate: (_ctx, data) => ({
      title: "Batch Mode: ON 📦",
      body: `${(data as { taskCount: number }).taskCount} ${(data as { category: string }).category} tasks queued. Stay in the zone — same type of work, zero context switching. Go.`,
      actionUrl: "/techniques/batch",
      actionLabel: "View Queue",
    }),
  },
  {
    id: "batch.category_suggestion",
    event: "cron.morning_brief",
    methodology: "batch",
    condition: (_ctx, data) =>
      (data as { batchableCategories: string[] }).batchableCategories?.length >= 1,
    cooldown: "PT20H",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (_ctx, data) => ({
      title: "Batch Opportunities Today 📦",
      body: `You have tasks in ${(data as { batchableCategories: string[] }).batchableCategories.join(", ")} that could be batched. Grouping similar work saves ~8 minutes per context switch.`,
      actionUrl: "/techniques/batch",
      actionLabel: "Create Batches",
    }),
  },
  {
    id: "batch.context_switch_warning",
    event: "task.started",
    methodology: "batch",
    condition: (_ctx, data) =>
      (data as { recentSwitches: number }).recentSwitches >= 4,
    cooldown: "PT2H",
    priority: "high",
    channels: ["in_app"],
    messageTemplate: (_ctx, data) => ({
      title: "Context Switching Alert ⚠️",
      body: `You've switched between ${(data as { recentSwitches: number }).recentSwitches} different task types in the last hour. Each switch costs ~23 minutes of refocus time. Consider batching similar tasks.`,
      actionUrl: "/techniques/batch",
      actionLabel: "Group Tasks",
    }),
  },
  {
    id: "batch.weekly_savings",
    event: "cron.weekly_review",
    methodology: "batch",
    condition: (_ctx, data) =>
      (data as { batchSessions: number }).batchSessions > 0,
    cooldown: "P6D",
    priority: "low",
    channels: ["in_app"],
    messageTemplate: (_ctx, data) => ({
      title: "Batch Processing Weekly Report",
      body: `${(data as { batchSessions: number }).batchSessions} batch sessions this week, ${(data as { tasksBatched: number }).tasksBatched} tasks completed. Estimated time saved: ${(data as { minutesSaved: number }).minutesSaved} minutes from reduced context switching.`,
      actionUrl: "/techniques/batch",
      actionLabel: "View Report",
    }),
  },
];
