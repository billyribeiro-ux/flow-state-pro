import type { CoachingTriggerDef } from "../types";

export const EISENHOWER_TRIGGERS: CoachingTriggerDef[] = [
  {
    id: "eisenhower.morning_sort",
    event: "cron.morning_brief",
    methodology: "eisenhower",
    condition: (ctx) => ctx.pendingTasks > 0,
    cooldown: "PT20H",
    priority: "high",
    channels: ["push", "in_app"],
    messageTemplate: (ctx) => ({
      title: "Morning Prioritization",
      body: `You have ${ctx.pendingTasks} tasks. Let's sort them — what's urgent AND important? Everything else can wait.`,
      actionUrl: "/techniques/eisenhower",
      actionLabel: "Open Matrix",
    }),
  },
  {
    id: "eisenhower.q3_warning",
    event: "time_audit.quadrant_check",
    methodology: "eisenhower",
    condition: (_ctx, data) =>
      (data as { q3Minutes: number }).q3Minutes > 120,
    cooldown: "PT4H",
    priority: "high",
    channels: ["push", "in_app"],
    messageTemplate: (_ctx, data) => ({
      title: "Priority Check ⚠️",
      body: `You've spent ${Math.round((data as { q3Minutes: number }).q3Minutes / 60)} hours on urgent-but-not-important work. Can you delegate or drop any of it?`,
      actionUrl: "/techniques/eisenhower",
      actionLabel: "Reprioritize",
    }),
  },
  {
    id: "eisenhower.q1_overload",
    event: "task.quadrant_assigned",
    methodology: "eisenhower",
    condition: (_ctx, data) =>
      (data as { q1Count: number }).q1Count > 5,
    cooldown: "PT6H",
    priority: "high",
    channels: ["in_app"],
    messageTemplate: () => ({
      title: "Everything Can't Be Urgent",
      body: "You have 5+ tasks in the Do quadrant. That's a sign something needs to be reclassified. True emergencies are rare.",
      actionUrl: "/techniques/eisenhower",
      actionLabel: "Review Matrix",
    }),
  },
  {
    id: "eisenhower.weekly_review",
    event: "cron.weekly_review",
    methodology: "eisenhower",
    condition: () => true,
    cooldown: "P6D",
    priority: "medium",
    channels: ["email", "in_app"],
    messageTemplate: (_ctx, data) => {
      const d = data as { q1Pct: number; q2Pct: number; q3Pct: number; q4Pct: number };
      return {
        title: "Weekly Quadrant Review",
        body: `This week: ${d.q1Pct}% urgent+important, ${d.q2Pct}% important-not-urgent, ${d.q3Pct}% urgent-not-important, ${d.q4Pct}% neither. ${d.q2Pct > 40 ? "Excellent — you're investing in what matters." : "Try to spend more time in Q2 next week — that's where real progress lives."}`,
        actionUrl: "/analytics",
        actionLabel: "Full Report",
      };
    },
  },
];
