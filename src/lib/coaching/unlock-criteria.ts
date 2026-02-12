import type { MethodologyId, UnlockRequirements } from "./types";

export const UNLOCK_CRITERIA: Record<MethodologyId, UnlockRequirements> = {
  pomodoro: {
    minDaysActive: 7,
    minSessions: 20,
    minMasteryScore: 30,
    additionalConditions: ["Completed at least one full set of 4 cycles"],
  },
  gtd: {
    minDaysActive: 7,
    minSessions: 5,
    minMasteryScore: 25,
    additionalConditions: [
      "Completed at least one Weekly Review",
      "Processed inbox to zero at least once",
    ],
  },
  eisenhower: {
    minDaysActive: 7,
    minSessions: 10,
    minMasteryScore: 30,
    additionalConditions: [
      "Categorized at least 20 tasks across all quadrants",
    ],
  },
  time_blocking: {
    minDaysActive: 7,
    minSessions: 7,
    minMasteryScore: 25,
    additionalConditions: [
      "Created time blocks for at least 5 days",
      "Average block adherence >= 60%",
    ],
  },
  pareto: {
    minDaysActive: 14,
    minSessions: 10,
    minMasteryScore: 35,
    additionalConditions: [
      "Completed at least two weekly 80/20 analyses",
      "Tagged at least 15 tasks with impact scores",
    ],
  },
  deep_work: {
    minDaysActive: 7,
    minSessions: 5,
    minMasteryScore: 30,
    additionalConditions: [
      "Completed at least one 90-minute deep work session",
      "Average distraction count < 5 per session",
    ],
  },
  eat_the_frog: {
    minDaysActive: 7,
    minSessions: 7,
    minMasteryScore: 30,
    additionalConditions: [
      "Eaten the frog before noon at least 5 times",
    ],
  },
  two_minute: {
    minDaysActive: 5,
    minSessions: 10,
    minMasteryScore: 25,
    additionalConditions: [
      "Cleared at least 20 two-minute tasks",
    ],
  },
  batch: {
    minDaysActive: 7,
    minSessions: 5,
    minMasteryScore: 25,
    additionalConditions: [
      "Completed at least 3 batch sessions",
      "Batched tasks from at least 3 different categories",
    ],
  },
  time_audit: {
    minDaysActive: 14,
    minSessions: 14,
    minMasteryScore: 30,
    additionalConditions: [
      "Tracked time for at least 10 complete days",
      "Reviewed at least 2 weekly time audit reports",
    ],
  },
};

export const MILESTONES = [
  { key: "sessions_10", label: "10 Sessions Complete", threshold: 10, field: "total_sessions" },
  { key: "sessions_50", label: "50 Sessions Complete", threshold: 50, field: "total_sessions" },
  { key: "sessions_100", label: "Century Club: 100 Sessions", threshold: 100, field: "total_sessions" },
  { key: "sessions_500", label: "500 Sessions — Elite Focus", threshold: 500, field: "total_sessions" },
  { key: "sessions_1000", label: "1,000 Sessions — Legendary", threshold: 1000, field: "total_sessions" },
  { key: "focus_60", label: "First Hour of Focus", threshold: 60, field: "total_focus_minutes" },
  { key: "focus_600", label: "10 Hours of Focus", threshold: 600, field: "total_focus_minutes" },
  { key: "focus_3000", label: "50 Hours of Deep Focus", threshold: 3000, field: "total_focus_minutes" },
  { key: "focus_6000", label: "100 Hours — Master Practitioner", threshold: 6000, field: "total_focus_minutes" },
  { key: "streak_7", label: "7-Day Streak 🔥", threshold: 7, field: "streak_current" },
  { key: "streak_14", label: "14-Day Streak 🔥🔥", threshold: 14, field: "streak_current" },
  { key: "streak_30", label: "30-Day Streak — Habit Formed", threshold: 30, field: "streak_current" },
  { key: "streak_60", label: "60-Day Streak — Unstoppable", threshold: 60, field: "streak_current" },
  { key: "streak_100", label: "100-Day Streak — Legend", threshold: 100, field: "streak_current" },
  { key: "streak_365", label: "365-Day Streak — One Full Year", threshold: 365, field: "streak_current" },
  { key: "methods_2", label: "Second Technique Activated", threshold: 2, field: "active_methodologies" },
  { key: "methods_5", label: "5 Techniques in Your Arsenal", threshold: 5, field: "active_methodologies" },
  { key: "methods_10", label: "Complete System — All 10 Mastered", threshold: 10, field: "mastered_methodologies" },
  { key: "frogs_eaten_30", label: "30 Frogs Eaten — Morning Warrior", threshold: 30, field: "frogs_eaten" },
  { key: "pomodoros_100", label: "100 Pomodoros — Focus Machine", threshold: 100, field: "pomodoros_completed" },
  { key: "deep_work_50h", label: "50 Hours of Deep Work", threshold: 3000, field: "deep_work_minutes" },
  { key: "tasks_completed_100", label: "100 Tasks Completed", threshold: 100, field: "tasks_completed" },
  { key: "tasks_completed_1000", label: "1,000 Tasks — Execution Machine", threshold: 1000, field: "tasks_completed" },
] as const;
