import type { MilestoneDef } from "./types";

export const MILESTONES: MilestoneDef[] = [
  // --- Session Milestones ---
  { key: "sessions_10", label: "First Steps", description: "Complete 10 focus sessions", threshold: 10, field: "total_sessions", icon: "🌱" },
  { key: "sessions_50", label: "Building Momentum", description: "Complete 50 focus sessions", threshold: 50, field: "total_sessions", icon: "🚀" },
  { key: "sessions_100", label: "Century Club", description: "Complete 100 focus sessions", threshold: 100, field: "total_sessions", icon: "💯" },
  { key: "sessions_500", label: "Elite Focus", description: "Complete 500 focus sessions", threshold: 500, field: "total_sessions", icon: "⚡" },
  { key: "sessions_1000", label: "Legendary", description: "Complete 1,000 focus sessions", threshold: 1000, field: "total_sessions", icon: "👑" },

  // --- Focus Time Milestones ---
  { key: "focus_60", label: "First Hour", description: "1 hour of total focus time", threshold: 60, field: "total_focus_minutes", icon: "⏰" },
  { key: "focus_600", label: "10 Hours Deep", description: "10 hours of focused work", threshold: 600, field: "total_focus_minutes", icon: "🔥" },
  { key: "focus_3000", label: "50 Hour Mark", description: "50 hours of focused work", threshold: 3000, field: "total_focus_minutes", icon: "💎" },
  { key: "focus_6000", label: "100 Hours Master", description: "100 hours of focused work", threshold: 6000, field: "total_focus_minutes", icon: "🏆" },
  { key: "focus_30000", label: "500 Hour Legend", description: "500 hours of focused work — that's 62 full work days", threshold: 30000, field: "total_focus_minutes", icon: "🌟" },

  // --- Streak Milestones ---
  { key: "streak_7", label: "One Week Strong", description: "7-day activity streak", threshold: 7, field: "streak_current", icon: "🔥" },
  { key: "streak_14", label: "Two Weeks Running", description: "14-day activity streak", threshold: 14, field: "streak_current", icon: "🔥🔥" },
  { key: "streak_30", label: "Habit Formed", description: "30-day streak — it's a habit now", threshold: 30, field: "streak_current", icon: "💪" },
  { key: "streak_60", label: "Unstoppable", description: "60-day streak — extraordinary consistency", threshold: 60, field: "streak_current", icon: "⚡" },
  { key: "streak_100", label: "Triple Digits", description: "100-day streak — elite discipline", threshold: 100, field: "streak_current", icon: "💯" },
  { key: "streak_365", label: "Full Year", description: "365-day streak — you haven't missed a day all year", threshold: 365, field: "streak_current", icon: "🏅" },

  // --- Task Milestones ---
  { key: "tasks_100", label: "100 Tasks Done", description: "Complete 100 tasks", threshold: 100, field: "total_tasks_completed", icon: "✅" },
  { key: "tasks_500", label: "500 Tasks Done", description: "Complete 500 tasks", threshold: 500, field: "total_tasks_completed", icon: "🎯" },
  { key: "tasks_1000", label: "Execution Machine", description: "Complete 1,000 tasks", threshold: 1000, field: "total_tasks_completed", icon: "⚙️" },

  // --- Pomodoro Milestones ---
  { key: "pomodoros_25", label: "First Full Day", description: "Complete 25 Pomodoros (one full set of 6)", threshold: 25, field: "total_pomodoros_completed", methodology: "pomodoro", icon: "🍅" },
  { key: "pomodoros_100", label: "Focus Machine", description: "Complete 100 Pomodoros", threshold: 100, field: "total_pomodoros_completed", methodology: "pomodoro", icon: "🍅💯" },
  { key: "pomodoros_500", label: "Pomodoro Master", description: "Complete 500 Pomodoros", threshold: 500, field: "total_pomodoros_completed", methodology: "pomodoro", icon: "🍅👑" },

  // --- Deep Work Milestones ---
  { key: "deep_work_10h", label: "10 Hours Deep", description: "10 hours of deep work sessions", threshold: 600, field: "total_deep_work_minutes", methodology: "deep_work", icon: "🧠" },
  { key: "deep_work_50h", label: "50 Hours Deep", description: "50 hours of deep work — you're building rare cognitive capacity", threshold: 3000, field: "total_deep_work_minutes", methodology: "deep_work", icon: "🧠💎" },
  { key: "deep_work_zero_distraction", label: "Zero Distraction Session", description: "Complete a 90+ minute deep work session with zero distractions", threshold: 1, field: "zero_distraction_sessions", methodology: "deep_work", icon: "🏆" },

  // --- Frog Milestones ---
  { key: "frogs_7", label: "Frog Week", description: "Eat your frog 7 days in a row", threshold: 7, field: "consecutive_frog_days", methodology: "eat_the_frog", icon: "🐸" },
  { key: "frogs_30", label: "Morning Warrior", description: "Eat your frog 30 days", threshold: 30, field: "total_frogs_eaten", methodology: "eat_the_frog", icon: "🐸💪" },
  { key: "frogs_100", label: "Frog Destroyer", description: "100 frogs eaten — procrastination is dead", threshold: 100, field: "total_frogs_eaten", methodology: "eat_the_frog", icon: "🐸👑" },

  // --- GTD Milestones ---
  { key: "gtd_inbox_zero_10", label: "Inbox Zero ×10", description: "Achieve inbox zero 10 times", threshold: 10, field: "inbox_zero_count", methodology: "gtd", icon: "📥✨" },
  { key: "gtd_weekly_reviews_10", label: "Review Habit", description: "Complete 10 weekly reviews", threshold: 10, field: "weekly_reviews_completed", methodology: "gtd", icon: "📋" },

  // --- Methodology Unlocks ---
  { key: "methods_2", label: "Dual Wielder", description: "Activate 2 productivity techniques", threshold: 2, field: "active_methodologies", icon: "🔓" },
  { key: "methods_5", label: "Multi-Tool Master", description: "Activate 5 productivity techniques", threshold: 5, field: "active_methodologies", icon: "🔓🔓" },
  { key: "methods_10", label: "Complete System", description: "Master all 10 techniques — you've built the complete productivity operating system", threshold: 10, field: "mastered_methodologies", icon: "🌟👑" },
];
