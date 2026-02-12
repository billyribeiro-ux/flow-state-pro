/**
 * FlowState Pro — COMPLETE Coaching Engine (Part 2)
 * 
 * Continues from Part 1 which covers:
 * - Types & Interfaces
 * - Pomodoro (10 triggers)
 * - Eisenhower (8 triggers)
 * - GTD (10 triggers)
 * - Time Blocking (8 triggers)
 * - Deep Work (8 triggers)
 * - Eat The Frog triggers 1-2 (morning + avoidance)
 * 
 * This file completes:
 * - Eat The Frog triggers 3-8
 * - Two-Minute Rule (6 triggers)
 * - Batch Processing (6 triggers)
 * - Pareto 80/20 (6 triggers)
 * - Time Audit (8 triggers)
 * - Cross-Methodology Intelligence (10 triggers)
 * - Progressive Unlock Criteria
 * - AI Prompt Library (ALL methodologies)
 * - Methodology Metadata & Definitions
 * - Notification Delivery Strategy
 * - Milestones (complete)
 */

import type {
  CoachingTriggerDef,
  UserContext,
  MethodologyId,
  CoachingChannel,
  CoachingPriority,
  CoachingTone,
} from "./coaching-engine-part1";

// ============================================================================
// 7. EAT THE FROG — Triggers 3-8 (continued)
// ============================================================================

export const EAT_THE_FROG_TRIGGERS_CONTINUED: CoachingTriggerDef[] = [
  {
    id: "eat_the_frog.completed",
    event: "task.completed",
    methodology: "eat_the_frog",
    condition: (_, d) => (d as any).isFrog === true,
    cooldown: "PT1M",
    priority: "high",
    channels: ["push", "in_app"],
    messageTemplate: (ctx) => {
      const hour = new Date().getHours();
      const beforeNoon = hour < 12;
      return {
        title: "FROG EATEN! 🎉🐸",
        body: `The hardest task of the day is DONE. ${beforeNoon ? "And you did it before noon — that's how top performers operate." : "Better late than never — the important thing is it's done."} Everything else today is downhill. Ride this momentum.`,
        actionUrl: "/dashboard",
        actionLabel: "Continue Day",
      };
    },
  },
  {
    id: "eat_the_frog.noon_warning",
    event: "cron.noon_check",
    methodology: "eat_the_frog",
    condition: (ctx) => ctx.frogStatus === "set",
    cooldown: "PT20H",
    priority: "critical",
    channels: ["push", "in_app"],
    messageTemplate: (ctx) => ({
      title: "Frog Still Alive at Noon 🕐",
      body: `It's noon and "${ctx.frogTitle}" hasn't been touched. Half the day is gone. Block the next 45 minutes RIGHT NOW and eat it. No email. No calls. Just the frog.`,
      actionUrl: "/techniques/eat-the-frog",
      actionLabel: "Start NOW",
    }),
  },
  {
    id: "eat_the_frog.afternoon_warning",
    event: "cron.afternoon_check",
    methodology: "eat_the_frog",
    condition: (ctx) => ctx.frogStatus === "set",
    cooldown: "PT20H",
    priority: "critical",
    channels: ["push", "in_app"],
    messageTemplate: (ctx) => ({
      title: "Last Chance for Your Frog ⚠️",
      body: `It's 3 PM. "${ctx.frogTitle}" is still uneaten. If you don't do it now, it becomes tomorrow's frog too — and it'll be even harder. 30 minutes. Just start.`,
      actionUrl: "/techniques/eat-the-frog",
      actionLabel: "Do It Now",
    }),
  },
  {
    id: "eat_the_frog.in_progress",
    event: "task.started",
    methodology: "eat_the_frog",
    condition: (_, d) => (d as any).isFrog === true,
    cooldown: "PT4H",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: () => ({
      title: "Frog in Progress 🐸💪",
      body: "You're doing the hard thing. This is the moment that separates people who want results from people who get them. Keep pushing.",
    }),
  },
  {
    id: "eat_the_frog.streak",
    event: "task.completed",
    methodology: "eat_the_frog",
    condition: (_, d) => (d as any).isFrog && (d as any).consecutiveFrogDays >= 5,
    cooldown: "PT20H",
    priority: "high",
    channels: ["push", "in_app"],
    messageTemplate: (_, d) => ({
      title: `${(d as any).consecutiveFrogDays}-Day Frog Streak! 🏆`,
      body: `You've eaten your frog ${(d as any).consecutiveFrogDays} days in a row. Most people can't do this for 3 days. You're building the habit of tackling hard things first — that changes everything.`,
      actionUrl: "/analytics",
      actionLabel: "View Progress",
    }),
  },
  {
    id: "eat_the_frog.end_of_day_missed",
    event: "cron.end_of_day",
    methodology: "eat_the_frog",
    condition: (ctx) => ctx.frogStatus === "set",
    cooldown: "PT20H",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (ctx) => ({
      title: "Frog Survived the Day",
      body: `"${ctx.frogTitle}" wasn't completed today. No judgment — but notice how it sat in the back of your mind all day. That mental weight costs energy. Tomorrow, eat it first thing.`,
      actionUrl: "/techniques/eat-the-frog",
      actionLabel: "Set Tomorrow's Frog",
    }),
  },
];

// ============================================================================
// 8. TWO-MINUTE RULE — 6 Triggers
// ============================================================================

export const TWO_MINUTE_TRIGGERS: CoachingTriggerDef[] = [
  {
    id: "two_minute.task_flagged",
    event: "task.created",
    methodology: "two_minute",
    condition: (_, d) => ((d as any).estimatedMinutes ?? 999) <= 2,
    cooldown: "PT5M",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (_, d) => ({
      title: "Two-Minute Task ⚡",
      body: `"${(d as any).title}" takes under 2 minutes. Do it NOW. The overhead of tracking, scheduling, and remembering it costs more than just doing it. David Allen's golden rule.`,
      actionUrl: "/techniques/two-minute",
      actionLabel: "Do It Now",
    }),
  },
  {
    id: "two_minute.batch_available",
    event: "cron.two_minute_scan",
    methodology: "two_minute",
    condition: (_, d) => ((d as any).twoMinuteCount || 0) >= 3,
    cooldown: "PT4H",
    priority: "medium",
    channels: ["push", "in_app"],
    messageTemplate: (_, d) => {
      const count = (d as any).twoMinuteCount || 0;
      return {
        title: `${count} Quick Wins Ready`,
        body: `${count} tasks under 2 minutes each. Knock them ALL out in one burst — ~${count * 2} minutes total. You'll feel incredible clearing that many items off your list.`,
        actionUrl: "/techniques/two-minute",
        actionLabel: "Clear Queue",
      };
    },
  },
  {
    id: "two_minute.deferred_warning",
    event: "task.deferred",
    methodology: "two_minute",
    condition: (_, d) => (d as any).isTwoMinute && ((d as any).deferCount || 0) >= 3,
    cooldown: "PT8H",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (_, d) => ({
      title: "Stop Deferring This",
      body: `"${(d as any).title}" — deferred ${(d as any).deferCount} times. It takes 2 minutes. You've already spent more mental energy avoiding it than doing it would cost. Just. Do. It.`,
      actionUrl: "/techniques/two-minute",
      actionLabel: "Do It Now",
    }),
  },
  {
    id: "two_minute.cleared_celebration",
    event: "task.two_minute_batch_cleared",
    methodology: "two_minute",
    condition: (_, d) => ((d as any).clearedCount || 0) >= 5,
    cooldown: "PT2H",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (_, d) => ({
      title: "Queue Cleared! ⚡✅",
      body: `${(d as any).clearedCount} quick tasks demolished in ${(d as any).totalMinutes} minutes. That's ${(d as any).clearedCount} fewer items clouding your mind. The Two-Minute Rule keeps your system clean.`,
      actionUrl: "/techniques/two-minute",
      actionLabel: "View Stats",
    }),
  },
  {
    id: "two_minute.morning_scan",
    event: "cron.morning_brief",
    methodology: "two_minute",
    condition: (_, d) => ((d as any).twoMinuteCount || 0) > 0,
    cooldown: "PT20H",
    priority: "low",
    channels: ["in_app"],
    messageTemplate: (_, d) => ({
      title: "Morning Quick Wins",
      body: `${(d as any).twoMinuteCount} two-minute tasks waiting. Start your day with a burst — clear these before your first Pomodoro for instant momentum.`,
      actionUrl: "/techniques/two-minute",
      actionLabel: "Clear Now",
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
    messageTemplate: (_, d) => ({
      title: "Two-Minute Rule Impact",
      body: `This week: ${(d as any).weeklyCleared || 0} quick tasks cleared, ${(d as any).weeklyDeferred || 0} deferred. ${(d as any).weeklyDeferred > (d as any).weeklyCleared ? "You're deferring more than doing — flip that ratio. Do them on sight." : "Good ratio. Keep doing tasks immediately when they take under 2 minutes."}`,
      actionUrl: "/analytics",
      actionLabel: "View Report",
    }),
  },
];

// ============================================================================
// 9. BATCH PROCESSING — 6 Triggers
// ============================================================================

export const BATCH_TRIGGERS: CoachingTriggerDef[] = [
  {
    id: "batch.pattern_detected",
    event: "task.created",
    methodology: "batch",
    condition: (_, d) => ((d as any).sameCategoryCount || 0) >= 3,
    cooldown: "PT2H",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (_, d) => ({
      title: "Batch Opportunity 📦",
      body: `${(d as any).sameCategoryCount} "${(d as any).category}" tasks queued. Batching saves ~${Math.round(((d as any).sameCategoryCount || 3) * 8)} minutes of context-switching overhead. Group them into one focused session.`,
      actionUrl: "/techniques/batch",
      actionLabel: "Create Batch",
    }),
  },
  {
    id: "batch.session_started",
    event: "session.started",
    methodology: "batch",
    condition: (_, d) => (d as any).sessionType === "batch",
    cooldown: "PT30M",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (_, d) => ({
      title: `Batch Session: ${(d as any).batchCategory}`,
      body: `${(d as any).taskCount} similar tasks, one focused session. Stay in this category — don't switch. Same context, same tools, same mindset. Flow through them.`,
    }),
  },
  {
    id: "batch.session_complete",
    event: "session.completed",
    methodology: "batch",
    condition: (_, d) => (d as any).sessionType === "batch",
    cooldown: "PT1M",
    priority: "medium",
    channels: ["in_app", "push"],
    messageTemplate: (_, d) => ({
      title: "Batch Complete ✅",
      body: `${(d as any).tasksCompleted} "${(d as any).batchCategory}" tasks done in ${(d as any).durationMinutes} minutes. Spread across the day, these would've taken ${Math.round(((d as any).durationMinutes || 30) * 1.5)} minutes with context-switching overhead. You saved ${Math.round(((d as any).durationMinutes || 30) * 0.5)} minutes.`,
      actionUrl: "/techniques/batch",
      actionLabel: "View Summary",
    }),
  },
  {
    id: "batch.category_suggestion",
    event: "cron.daily_check",
    methodology: "batch",
    condition: (_, d) => ((d as any).suggestedBatches || []).length > 0,
    cooldown: "PT8H",
    priority: "low",
    channels: ["in_app"],
    messageTemplate: (_, d) => {
      const batches = (d as any).suggestedBatches as Array<{ category: string; count: number }>;
      const top = batches[0];
      return {
        title: "Batch Suggestions for Today",
        body: `You have ${top?.count || 0} "${top?.category || "similar"}" tasks${batches.length > 1 ? ` and ${batches[1]?.count || 0} "${batches[1]?.category || "other"}" tasks` : ""}. Schedule a batch session to power through them without switching gears.`,
        actionUrl: "/techniques/batch",
        actionLabel: "Create Batch",
      };
    },
  },
  {
    id: "batch.context_switch_warning",
    event: "task.started",
    methodology: "batch",
    condition: (_, d) =>
      (d as any).categoryChanged &&
      ((d as any).switchesThisHour || 0) >= 3,
    cooldown: "PT2H",
    priority: "high",
    channels: ["in_app"],
    messageTemplate: (_, d) => ({
      title: "Context Switching Alert ⚠️",
      body: `You've switched between ${(d as any).switchesThisHour} different task categories in the last hour. Each switch costs 23 minutes of cognitive recovery. Group similar tasks and batch them together.`,
      actionUrl: "/techniques/batch",
      actionLabel: "Group Tasks",
    }),
  },
  {
    id: "batch.weekly_savings",
    event: "cron.weekly_review",
    methodology: "batch",
    condition: (_, d) => ((d as any).batchSessionsThisWeek || 0) > 0,
    cooldown: "P6D",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (_, d) => ({
      title: "Weekly Batch Report",
      body: `${(d as any).batchSessionsThisWeek} batch sessions this week, ${(d as any).batchTasksCompleted} tasks completed. Estimated time saved: ${(d as any).estimatedMinutesSaved} minutes. That's ${Math.round(((d as any).estimatedMinutesSaved || 0) / 60 * 10) / 10} hours you didn't waste on context switching.`,
      actionUrl: "/analytics",
      actionLabel: "Full Report",
    }),
  },
];

// ============================================================================
// 10. PARETO (80/20 RULE) — 6 Triggers
// ============================================================================

export const PARETO_TRIGGERS: CoachingTriggerDef[] = [
  {
    id: "pareto.weekly_analysis",
    event: "cron.friday_analysis",
    methodology: "pareto",
    condition: () => true,
    cooldown: "P6D",
    priority: "high",
    channels: ["push", "email", "in_app"],
    messageTemplate: (_, d) => ({
      title: "Your 80/20 Report 📊",
      body: `This week: ${(d as any).topActivitiesCount || 0} activities generated 80% of your results. ${(d as any).bottomActivitiesCount || 0} activities contributed almost nothing. Double down on what works. Eliminate or minimize what doesn't.`,
      actionUrl: "/techniques/pareto",
      actionLabel: "View Analysis",
    }),
  },
  {
    id: "pareto.low_impact_warning",
    event: "time_audit.activity_check",
    methodology: "pareto",
    condition: (_, d) => ((d as any).lowImpactMinutes || 0) > 120,
    cooldown: "PT6H",
    priority: "high",
    channels: ["in_app"],
    messageTemplate: (_, d) => ({
      title: "Low-Impact Time Alert ⚠️",
      body: `${Math.round(((d as any).lowImpactMinutes || 0) / 60)} hours on low-impact activities today. That's in the bottom 80% of your value creation. Stop and ask: "Is this the highest-leverage thing I could be doing right now?"`,
      actionUrl: "/techniques/pareto",
      actionLabel: "See High-Impact",
    }),
  },
  {
    id: "pareto.high_impact_streak",
    event: "task.completed",
    methodology: "pareto",
    condition: (_, d) => (d as any).paretoCategory === "high_impact" && ((d as any).highImpactStreak || 0) >= 3,
    cooldown: "PT4H",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (_, d) => ({
      title: "On a High-Impact Roll 🎯",
      body: `${(d as any).highImpactStreak} consecutive high-impact tasks completed. You're in the top 20% of activities that drive 80% of results. Keep this focus.`,
    }),
  },
  {
    id: "pareto.impact_tagging_reminder",
    event: "cron.daily_check",
    methodology: "pareto",
    condition: (_, d) => ((d as any).untaggedTasks || 0) > 5,
    cooldown: "P2D",
    priority: "low",
    channels: ["in_app"],
    messageTemplate: (_, d) => ({
      title: "Tag Your Tasks for Impact",
      body: `${(d as any).untaggedTasks} tasks have no impact score. The 80/20 analysis needs impact ratings to find your highest-leverage activities. Take 5 minutes to rate them.`,
      actionUrl: "/techniques/pareto",
      actionLabel: "Rate Tasks",
    }),
  },
  {
    id: "pareto.monthly_trend",
    event: "cron.monthly_check",
    methodology: "pareto",
    condition: () => true,
    cooldown: "P25D",
    priority: "medium",
    channels: ["email", "in_app"],
    messageTemplate: (_, d) => ({
      title: "Monthly Pareto Trend",
      body: `Over the past month, your high-impact to low-impact ratio ${(d as any).ratioImproving ? "has improved — you're spending more time on what matters." : "needs work. You're still spending too many hours on activities that don't move the needle."} Your top 3 high-impact categories: ${(d as any).topCategories || "Review your dashboard for details."}`,
      actionUrl: "/techniques/pareto",
      actionLabel: "Full Analysis",
    }),
  },
  {
    id: "pareto.task_started_low_impact",
    event: "task.started",
    methodology: "pareto",
    condition: (_, d) => (d as any).paretoCategory === "low_impact",
    cooldown: "PT2H",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (_, d) => ({
      title: "Low-Impact Task Started",
      body: `"${(d as any).title}" is rated as low-impact. Before diving in — is this the best use of your time right now? Check if any high-impact tasks are waiting.`,
      actionUrl: "/techniques/pareto",
      actionLabel: "See Alternatives",
    }),
  },
];

// ============================================================================
// 11. TIME AUDIT — 8 Triggers
// ============================================================================

export const TIME_AUDIT_TRIGGERS: CoachingTriggerDef[] = [
  {
    id: "time_audit.start_tracking",
    event: "cron.morning_brief",
    methodology: "time_audit",
    condition: () => true,
    cooldown: "PT20H",
    priority: "high",
    channels: ["push", "in_app"],
    messageTemplate: () => ({
      title: "Start Your Time Tracker ⏱️",
      body: "What you measure, you manage. Start tracking your first activity now. Categorize everything — meetings, deep work, admin, breaks, distractions. The data tells the truth your feelings don't.",
      actionUrl: "/techniques/time-audit",
      actionLabel: "Start Tracking",
    }),
  },
  {
    id: "time_audit.tracking_gap",
    event: "cron.tracking_gap_check",
    methodology: "time_audit",
    condition: (_, d) => ((d as any).gapMinutes || 0) > 30,
    cooldown: "PT2H",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (_, d) => ({
      title: "Tracking Gap Detected",
      body: `${(d as any).gapMinutes} minutes unaccounted for since your last entry. What were you doing? Log it now while it's fresh. Even "I don't remember" is useful data.`,
      actionUrl: "/techniques/time-audit",
      actionLabel: "Log Entry",
    }),
  },
  {
    id: "time_audit.daily_report",
    event: "cron.end_of_day",
    methodology: "time_audit",
    condition: () => true,
    cooldown: "PT20H",
    priority: "medium",
    channels: ["in_app", "push"],
    messageTemplate: (_, d) => {
      const planned = (d as any).plannedHours || 0;
      const actual = (d as any).actualHours || 0;
      const productive = (d as any).productiveHours || 0;
      const tracked = (d as any).trackedHours || 0;
      return {
        title: "Where Your Time Went Today",
        body: `Tracked: ${tracked}h total. Productive: ${productive}h. ${planned > 0 ? `Planned vs actual: ${planned}h planned, ${actual}h delivered. ${actual >= planned ? "You hit your target. 🎯" : `${Math.round((planned - actual) * 60)}min gap — what pulled you off course?`}` : "Start planning your time tomorrow to compare planned vs actual."}`,
        actionUrl: "/techniques/time-audit",
        actionLabel: "View Report",
      };
    },
  },
  {
    id: "time_audit.perception_vs_reality",
    event: "cron.weekly_review",
    methodology: "time_audit",
    condition: () => true,
    cooldown: "P6D",
    priority: "high",
    channels: ["email", "in_app"],
    messageTemplate: (_, d) => ({
      title: "Perception vs Reality ⏰",
      body: `You think you spend ${(d as any).perceivedDeepWork || 0}h on deep work. You actually spend ${(d as any).actualDeepWork || 0}h. You think meetings take ${(d as any).perceivedMeetings || 0}h. They actually take ${(d as any).actualMeetings || 0}h. This gap is why time audits exist — you can't manage what you don't measure accurately.`,
      actionUrl: "/techniques/time-audit/reports",
      actionLabel: "Full Report",
    }),
  },
  {
    id: "time_audit.category_alert",
    event: "time_audit.category_threshold",
    methodology: "time_audit",
    condition: (_, d) => ((d as any).categoryMinutes || 0) > ((d as any).categoryLimit || 999),
    cooldown: "PT4H",
    priority: "high",
    channels: ["in_app"],
    messageTemplate: (_, d) => ({
      title: `Overinvesting in ${(d as any).category}`,
      body: `${Math.round(((d as any).categoryMinutes || 0) / 60)} hours on "${(d as any).category}" today — that's over your ${Math.round(((d as any).categoryLimit || 0) / 60)}h target. Is this intentional or did you lose track? Reallocate time to higher-value categories.`,
      actionUrl: "/techniques/time-audit",
      actionLabel: "Rebalance",
    }),
  },
  {
    id: "time_audit.heatmap_insight",
    event: "cron.weekly_review",
    methodology: "time_audit",
    condition: () => true,
    cooldown: "P6D",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (_, d) => ({
      title: "Your Productivity Heatmap",
      body: `Peak productivity: ${(d as any).peakDay} at ${(d as any).peakHour}. Lowest: ${(d as any).lowDay} at ${(d as any).lowHour}. Schedule your hardest work during peak hours and routine tasks during low periods. Work WITH your energy, not against it.`,
      actionUrl: "/techniques/time-audit/reports",
      actionLabel: "View Heatmap",
    }),
  },
  {
    id: "time_audit.unproductive_pattern",
    event: "cron.daily_check",
    methodology: "time_audit",
    condition: (_, d) => ((d as any).unproductiveMinutes || 0) > 120,
    cooldown: "PT20H",
    priority: "high",
    channels: ["in_app"],
    messageTemplate: (_, d) => ({
      title: "Unproductive Time Spike",
      body: `${Math.round(((d as any).unproductiveMinutes || 0) / 60)} hours logged as unproductive today. Top culprits: ${(d as any).topUnproductiveCategories || "Review your entries."}. No judgment — the awareness alone starts to shift behavior. What's one thing you can change tomorrow?`,
      actionUrl: "/techniques/time-audit",
      actionLabel: "Review Entries",
    }),
  },
  {
    id: "time_audit.consistency_check",
    event: "cron.daily_check",
    methodology: "time_audit",
    condition: (_, d) => ((d as any).daysTracked || 0) < 5 && ((d as any).activeDays || 0) > 7,
    cooldown: "P3D",
    priority: "medium",
    channels: ["push", "in_app"],
    messageTemplate: (_, d) => ({
      title: "Track More Consistently",
      body: `You've only tracked ${(d as any).daysTracked} of the last 7 days. Time audits need consistent data to reveal real patterns. Aim to track at least 5 days this week. Even rough estimates are valuable.`,
      actionUrl: "/techniques/time-audit",
      actionLabel: "Start Today",
    }),
  },
];

// ============================================================================
// 12. CROSS-METHODOLOGY INTELLIGENCE — 10 Triggers
// ============================================================================

export const CROSS_METHODOLOGY_TRIGGERS: CoachingTriggerDef[] = [
  {
    id: "cross.methodology_unlock",
    event: "methodology.unlock_ready",
    methodology: "cross_methodology",
    condition: () => true,
    cooldown: "P1D",
    priority: "critical",
    channels: ["push", "email", "in_app"],
    messageTemplate: (_, d) => ({
      title: "New Technique Unlocked! 🔓",
      body: `You've built a solid foundation with ${(d as any).currentMethodology}. Ready for the next level? "${(d as any).unlockedMethodologyName}" complements what you've already learned and will amplify your results.`,
      actionUrl: `/onboarding/${(d as any).unlockedMethodologySlug}`,
      actionLabel: "Explore",
    }),
  },
  {
    id: "cross.streak_at_risk",
    event: "cron.evening_check",
    methodology: "cross_methodology",
    condition: (ctx) => ctx.streakCurrent >= 3 && ctx.todaysSessions === 0,
    cooldown: "PT20H",
    priority: "critical",
    channels: ["push", "in_app"],
    messageTemplate: (ctx) => ({
      title: `${ctx.streakCurrent}-Day Streak at Risk 🔥`,
      body: `Your ${ctx.streakCurrent}-day streak is about to break. Even one Pomodoro, a 2-minute task burst, or a quick frog attempt keeps it alive. Don't let momentum die.`,
      actionUrl: "/dashboard",
      actionLabel: "Quick Session",
    }),
  },
  {
    id: "cross.streak_broken",
    event: "cron.streak_reset",
    methodology: "cross_methodology",
    condition: (_, d) => ((d as any).previousStreak || 0) >= 3,
    cooldown: "PT20H",
    priority: "high",
    channels: ["push", "in_app"],
    messageTemplate: (_, d) => ({
      title: "Streak Reset",
      body: `Your ${(d as any).previousStreak}-day streak ended. That's okay — ${(d as any).previousStreak} days of consistency is something to be proud of. Start rebuilding today. The new streak starts with one session.`,
      actionUrl: "/dashboard",
      actionLabel: "Restart",
    }),
  },
  {
    id: "cross.milestone_celebration",
    event: "analytics.milestone_reached",
    methodology: "cross_methodology",
    condition: () => true,
    cooldown: "PT1H",
    priority: "high",
    channels: ["push", "in_app"],
    messageTemplate: (_, d) => ({
      title: `${(d as any).milestone} 🏆`,
      body: (d as any).description,
      actionUrl: "/analytics",
      actionLabel: "View Progress",
    }),
  },
  {
    id: "cross.pomodoro_to_deep_work",
    event: "cron.daily_check",
    methodology: "cross_methodology",
    condition: (ctx, d) =>
      ctx.unlockedMethodologies.includes("deep_work") &&
      ((d as any).avgPomodoroFocusRating || 0) >= 4 &&
      ((d as any).pomodorosToday || 0) >= 4,
    cooldown: "P3D",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: () => ({
      title: "Ready for Deep Work?",
      body: "Your Pomodoro focus ratings are consistently high. You might be ready to try longer Deep Work sessions (60-90 min). Your focus muscle is strong enough — let it stretch.",
      actionUrl: "/techniques/deep-work",
      actionLabel: "Try Deep Work",
    }),
  },
  {
    id: "cross.eisenhower_meets_time_audit",
    event: "cron.weekly_review",
    methodology: "cross_methodology",
    condition: (ctx) =>
      ctx.unlockedMethodologies.includes("eisenhower") &&
      ctx.unlockedMethodologies.includes("time_audit"),
    cooldown: "P6D",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (_, d) => ({
      title: "Quadrant + Time Audit Insight",
      body: `Your Time Audit reveals: ${(d as any).q1Pct || 0}% on Q1 (fires), ${(d as any).q2Pct || 0}% on Q2 (strategic), ${(d as any).q3Pct || 0}% on Q3 (delegable), ${(d as any).q4Pct || 0}% on Q4 (waste). ${(d as any).q2Pct < 30 ? "Your strategic Q2 work is being squeezed — protect it with time blocks." : "Good Q2 investment — keep it up."}`,
      actionUrl: "/analytics",
      actionLabel: "Deep Dive",
    }),
  },
  {
    id: "cross.frog_meets_pomodoro",
    event: "cron.morning_brief",
    methodology: "cross_methodology",
    condition: (ctx) =>
      ctx.unlockedMethodologies.includes("eat_the_frog") &&
      ctx.unlockedMethodologies.includes("pomodoro") &&
      ctx.frogTitle !== null,
    cooldown: "PT20H",
    priority: "high",
    channels: ["in_app"],
    messageTemplate: (ctx) => ({
      title: "Eat Your Frog in Pomodoros",
      body: `Today's frog: "${ctx.frogTitle}". Start a Pomodoro focused exclusively on this. Breaking the frog into 25-minute chunks makes it less intimidating and more achievable.`,
      actionUrl: "/techniques/pomodoro",
      actionLabel: "Frog Pomodoro",
    }),
  },
  {
    id: "cross.time_audit_reveals_batching",
    event: "cron.weekly_review",
    methodology: "cross_methodology",
    condition: (ctx, d) =>
      ctx.unlockedMethodologies.includes("time_audit") &&
      ctx.unlockedMethodologies.includes("batch") &&
      ((d as any).contextSwitches || 0) > 20,
    cooldown: "P6D",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (_, d) => ({
      title: "Time Audit → Batching Opportunity",
      body: `Your Time Audit shows ${(d as any).contextSwitches} context switches this week. That's ~${Math.round(((d as any).contextSwitches || 0) * 5)} minutes of lost transition time. Batch "${(d as any).topSwitchCategory}" tasks into dedicated sessions.`,
      actionUrl: "/techniques/batch",
      actionLabel: "Create Batches",
    }),
  },
  {
    id: "cross.gtd_meets_eisenhower",
    event: "cron.daily_check",
    methodology: "cross_methodology",
    condition: (ctx) =>
      ctx.unlockedMethodologies.includes("gtd") &&
      ctx.unlockedMethodologies.includes("eisenhower") &&
      ctx.unprocessedInboxItems > 10,
    cooldown: "P2D",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (ctx) => ({
      title: "GTD + Eisenhower Power Combo",
      body: `${ctx.unprocessedInboxItems} inbox items need processing. As you clarify each one, place it in the Eisenhower matrix. Two-minute tasks? Do them. Not actionable? Trash or reference. Actionable? Sort by urgency and importance.`,
      actionUrl: "/techniques/gtd/inbox",
      actionLabel: "Process & Sort",
    }),
  },
  {
    id: "cross.pareto_meets_time_blocking",
    event: "cron.weekly_review",
    methodology: "cross_methodology",
    condition: (ctx) =>
      ctx.unlockedMethodologies.includes("pareto") &&
      ctx.unlockedMethodologies.includes("time_blocking"),
    cooldown: "P6D",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (_, d) => ({
      title: "Block Your 20%",
      body: `Your Pareto analysis shows "${(d as any).topActivity}" is your highest-leverage activity. Yet you only spent ${(d as any).topActivityHours}h on it this week. Create dedicated time blocks for your top 20% activities next week.`,
      actionUrl: "/techniques/time-blocking",
      actionLabel: "Schedule 20%",
    }),
  },
];

// ============================================================================
// 13. PROGRESSIVE UNLOCK CRITERIA
// ============================================================================

export interface UnlockRequirements {
  minDaysActive: number;
  minSessions: number;
  minMasteryScore: number;
  additionalConditions: string[];
}

export const UNLOCK_CRITERIA: Record<MethodologyId, UnlockRequirements> = {
  pomodoro: {
    minDaysActive: 7,
    minSessions: 20,
    minMasteryScore: 30,
    additionalConditions: [
      "Completed at least one full set of 4 Pomodoro cycles",
      "Average focus rating >= 3.0",
    ],
  },
  gtd: {
    minDaysActive: 7,
    minSessions: 5,
    minMasteryScore: 25,
    additionalConditions: [
      "Completed at least one Weekly Review",
      "Processed inbox to zero at least once",
      "Created at least 3 projects with next actions",
    ],
  },
  eisenhower: {
    minDaysActive: 7,
    minSessions: 10,
    minMasteryScore: 30,
    additionalConditions: [
      "Categorized at least 20 tasks across all 4 quadrants",
      "Worked on Q2 tasks at least 3 days",
    ],
  },
  time_blocking: {
    minDaysActive: 7,
    minSessions: 7,
    minMasteryScore: 25,
    additionalConditions: [
      "Created time blocks for at least 5 days",
      "Average block adherence >= 60%",
      "Used at least 3 different block types",
    ],
  },
  pareto: {
    minDaysActive: 14,
    minSessions: 10,
    minMasteryScore: 35,
    additionalConditions: [
      "Completed at least two weekly 80/20 analyses",
      "Tagged at least 15 tasks with impact scores",
      "Identified and completed 5+ high-impact tasks",
    ],
  },
  deep_work: {
    minDaysActive: 7,
    minSessions: 5,
    minMasteryScore: 30,
    additionalConditions: [
      "Completed at least one 90-minute deep work session",
      "Average distraction count < 5 per session",
      "Rated at least 3 sessions with focus rating >= 4",
    ],
  },
  eat_the_frog: {
    minDaysActive: 7,
    minSessions: 7,
    minMasteryScore: 30,
    additionalConditions: [
      "Eaten the frog before noon at least 5 times",
      "Set a frog for at least 7 consecutive days",
    ],
  },
  two_minute: {
    minDaysActive: 5,
    minSessions: 10,
    minMasteryScore: 25,
    additionalConditions: [
      "Cleared at least 20 two-minute tasks",
      "Defer rate below 30%",
    ],
  },
  batch: {
    minDaysActive: 7,
    minSessions: 5,
    minMasteryScore: 25,
    additionalConditions: [
      "Completed at least 3 batch sessions",
      "Batched tasks from at least 3 different categories",
      "Completed 15+ tasks through batching",
    ],
  },
  time_audit: {
    minDaysActive: 14,
    minSessions: 14,
    minMasteryScore: 30,
    additionalConditions: [
      "Tracked time for at least 10 complete days",
      "Categorized entries into at least 5 categories",
      "Reviewed at least 2 weekly time audit reports",
    ],
  },
};

// ============================================================================
// 14. METHODOLOGY PROGRESSION MAP
// ============================================================================

export const METHODOLOGY_PROGRESSION: Record<MethodologyId, MethodologyId[]> = {
  pomodoro: ["time_blocking", "deep_work", "batch"],
  gtd: ["two_minute", "eisenhower", "batch"],
  eisenhower: ["eat_the_frog", "pareto", "time_audit"],
  time_blocking: ["pomodoro", "deep_work", "batch"],
  pareto: ["eisenhower", "time_audit", "eat_the_frog"],
  deep_work: ["time_blocking", "eat_the_frog", "pomodoro"],
  eat_the_frog: ["eisenhower", "pomodoro", "deep_work"],
  two_minute: ["gtd", "batch", "eisenhower"],
  batch: ["time_blocking", "pomodoro", "two_minute"],
  time_audit: ["pareto", "time_blocking", "eisenhower"],
};

// ============================================================================
// 15. AI PROMPT LIBRARY
// ============================================================================

export function buildCoachingSystemPrompt(ctx: UserContext): string {
  return `You are FlowState Coach, an expert productivity coach integrated into the FlowState Pro platform.

## Your Role
Direct, results-oriented productivity coach. You don't coddle — you challenge, support, and hold accountable. Think: the coach who makes you better, not the one who tells you what you want to hear.

## Communication Style: ${ctx.coachingTone}
${ctx.coachingTone === "encouraging" ? "Lead with positivity but don't shy from honest feedback. Celebrate wins, frame challenges as growth opportunities. Use affirmation before redirection." : ""}
${ctx.coachingTone === "direct" ? "Cut to the chase. No fluff. No filler words. Give actionable advice in minimal words. Challenge excuses immediately. Respect the user's intelligence." : ""}
${ctx.coachingTone === "analytical" ? "Lead with data, patterns, and metrics. Reference specific numbers. Frame advice in terms of optimization, efficiency gains, and measurable improvement." : ""}
${ctx.coachingTone === "motivational" ? "High energy. Reference progress, streaks, and personal bests. Frame everything as building toward mastery. Use momentum language — 'building', 'leveling up', 'compounding'." : ""}

## User Context
- Name: ${ctx.firstName || "User"}
- Active methodology: ${ctx.activeMethodology || "none selected"}
- Unlocked techniques: ${ctx.unlockedMethodologies.join(", ") || "none"}
- Current streak: ${ctx.streakCurrent} days (longest: ${ctx.streakLongest})
- Today: ${ctx.todaysSessions} sessions, ${ctx.todaysFocusMinutes} min focused, ${ctx.todaysPomodorosCompleted} Pomodoros
- Pending tasks: ${ctx.pendingTasks}
- Frog status: ${ctx.frogStatus}${ctx.frogTitle ? ` ("${ctx.frogTitle}")` : ""}
- GTD inbox: ${ctx.unprocessedInboxItems} unprocessed items
- Lifetime: ${ctx.totalFocusMinutes} total focus minutes, ${ctx.totalTasksCompleted} tasks completed

## Rules
1. ALWAYS be specific. Never say "try to focus more." Say "Start a 25-minute Pomodoro on your highest-priority task right now."
2. Reference the user's actual data — numbers, streaks, patterns, metrics.
3. Keep responses CONCISE — under 150 words unless detailed analysis is requested.
4. Every response ends with a clear, actionable next step.
5. If the user struggles, acknowledge briefly (1 sentence max) then redirect to action.
6. Cross-reference methodologies: "Your Time Audit shows you're most focused at 9am — schedule your frog there."
7. Never be preachy or lecture. Be a peer who's been through it.
8. If asked about a locked methodology, explain unlock criteria and encourage progress.
9. Use the user's own metrics to motivate: "You've completed 47 Pomodoros this week — that's your best week ever."
10. Don't repeat generic productivity advice. Be specific to THIS user, THIS day, THIS situation.`;
}

export function buildDailyBriefingPrompt(
  methodology: MethodologyId | null,
  userData: Record<string, unknown>
): string {
  const methodologyInstructions: Record<MethodologyId, string> = {
    pomodoro: "Frame the day in Pomodoro targets. Reference yesterday's count and suggest today's goal. If they're on a streak of high counts, challenge them. If struggling, suggest starting with just 4.",
    eisenhower: "Highlight which quadrant needs the most attention today. If Q2 is neglected, make it the priority. If Q1 is overloaded, suggest reclassification. Show the quadrant distribution.",
    gtd: "Check inbox status first. If items are piling up, make processing the first action. Highlight stale projects with no next actions. If weekly review is due, surface it.",
    time_blocking: "Preview today's scheduled blocks. Note key transitions. If no blocks are set, that's the top priority. Reference yesterday's adherence score.",
    deep_work: "Identify the best window for deep work based on their historical patterns. Suggest what to work on during deep work. Note total deep work hours this week vs goal.",
    eat_the_frog: "Surface the frog task prominently. Create urgency around completing it before noon. Reference their frog completion streak and frog-before-noon rate.",
    pareto: "Highlight the day's highest-impact activities based on past Pareto analysis. Warn about time sinks from previous patterns. Reference their impact-to-effort ratio.",
    two_minute: "Note any queued quick tasks. Suggest clearing them as a morning warm-up before deep work. Reference how many they've cleared this week.",
    batch: "Suggest batch groupings from today's task list. Note which categories have accumulated enough tasks for a batch session. Reference time saved from batching this week.",
    time_audit: "Compare yesterday's planned vs actual. Set today's tracking focus. Reference the most surprising insight from recent audits. Note their most productive time window.",
  };

  return `Generate a personalized morning briefing for ${(userData as any).firstName || "this user"}.

## Format (STRICT)
1. Greeting (1 line — use their name, reference day of week)
2. Yesterday's highlight (1 line — celebrate something specific and real from their data)
3. Today's priority (2-3 lines — methodology-specific, data-driven)
4. Actionable first step (1 line — specific, immediate, do-it-right-now action)

## Methodology Focus: ${methodology || "general productivity"}
${methodology ? methodologyInstructions[methodology] : "Give a balanced overview across their active methodologies."}

## User Data for Personalization
${JSON.stringify(userData, null, 2)}

## Rules
- TOTAL WORD COUNT: Under 100 words. Not a word more.
- Every claim must reference actual data from the user's metrics.
- End with ONE clear action for the next 5 minutes.
- No generic advice. No "remember to stay focused." Be SPECIFIC.
- Match the user's coaching tone preference.`;
}

export function buildWeeklyInsightsPrompt(
  ctx: UserContext,
  weeklyData: Record<string, unknown>
): string {
  return `Generate 3 actionable weekly insights for ${ctx.firstName || "this user"}'s FlowState Pro weekly review.

## User Context
- Active techniques: ${ctx.unlockedMethodologies.join(", ")}
- Primary methodology: ${ctx.activeMethodology}
- Current streak: ${ctx.streakCurrent} days
- Coaching tone: ${ctx.coachingTone}

## This Week's Data
${JSON.stringify(weeklyData, null, 2)}

## Output Format (STRICT)
Return exactly 3 insights as JSON array:
[
  {
    "type": "strength" | "opportunity" | "pattern",
    "insight": "One sentence describing the finding with specific numbers",
    "methodology": "which technique this relates to",
    "actionable": "One specific action to take next week"
  }
]

## Rules
- Each insight MUST reference specific numbers from the data.
- "strength" = something they're doing well (reinforce it).
- "opportunity" = something they could improve (specific suggestion).
- "pattern" = a behavioral pattern detected (awareness + action).
- Be direct. No filler. Each insight is 1-2 sentences max.
- The actionable step must be concrete enough to execute immediately.`;
}

export function buildParetoAnalysisPrompt(
  taskData: Record<string, unknown>[]
): string {
  return `Analyze this user's completed tasks to identify their Pareto distribution.

## Task Data (This Week)
${JSON.stringify(taskData, null, 2)}

## Analysis Required
1. Rank all activities by impact score × completion rate
2. Identify the top 20% of activities that generated ~80% of value
3. Identify the bottom 80% of activities with diminishing returns
4. Calculate the exact Pareto ratio (it won't be exactly 80/20)

## Output Format (STRICT JSON)
{
  "paretoRatio": "The actual ratio found (e.g., '75/25' or '85/15')",
  "topActivities": [
    { "category": "string", "impactScore": number, "timeInvested": number, "recommendation": "string" }
  ],
  "bottomActivities": [
    { "category": "string", "impactScore": number, "timeInvested": number, "recommendation": "string" }
  ],
  "keyInsight": "One sentence: what should they do more of and less of",
  "actionItem": "Specific action for next week"
}`;
}

// ============================================================================
// 16. METHODOLOGY METADATA
// ============================================================================

export interface MethodologyMetadata {
  id: MethodologyId;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  color: string;
  colorLight: string;
  creator: string;
  keyBenefit: string;
  idealFor: string[];
  videoDescription: string;
  onboardingHook: string;
}

export const METHODOLOGY_METADATA: Record<MethodologyId, MethodologyMetadata> = {
  pomodoro: {
    id: "pomodoro",
    name: "Pomodoro Technique",
    tagline: "25 minutes of focus. 5 minutes of rest. Repeat.",
    description: "Work in focused 25-minute intervals (Pomodoros) separated by short breaks. After 4 Pomodoros, take a longer break. Simple, effective, and the foundation of structured focus.",
    icon: "Timer",
    color: "#e03131",
    colorLight: "#ffe3e3",
    creator: "Francesco Cirillo",
    keyBenefit: "Eliminates procrastination by making focus manageable",
    idealFor: ["People who struggle to start tasks", "Those easily distracted", "Anyone who loses track of time"],
    videoDescription: "How the Pomodoro Technique turns 25 minutes into your most powerful productivity tool",
    onboardingHook: "Can't focus for long? You only need 25 minutes.",
  },
  gtd: {
    id: "gtd",
    name: "Getting Things Done",
    tagline: "Capture everything. Organize once. Trust your system.",
    description: "David Allen's complete productivity system: capture all commitments into an inbox, clarify next actions, organize by context, review weekly, and execute with confidence. Your mind becomes free to think, not remember.",
    icon: "Tray",
    color: "#2f9e44",
    colorLight: "#d3f9d8",
    creator: "David Allen",
    keyBenefit: "Eliminates mental overhead by externalizing all commitments",
    idealFor: ["People juggling many projects", "Those with racing minds", "Anyone who drops balls"],
    videoDescription: "Master the 5-step GTD workflow that Fortune 500 executives swear by",
    onboardingHook: "Too many things in your head? Get them ALL out.",
  },
  eisenhower: {
    id: "eisenhower",
    name: "Eisenhower Matrix",
    tagline: "What's important is seldom urgent. What's urgent is seldom important.",
    description: "Sort every task into four quadrants based on urgency and importance. Do urgent+important. Schedule important-not-urgent. Delegate urgent-not-important. Eliminate the rest. Focus on Q2 for strategic advantage.",
    icon: "GridFour",
    color: "#1971c2",
    colorLight: "#d0ebff",
    creator: "Dwight D. Eisenhower",
    keyBenefit: "Prevents urgency from hijacking what actually matters",
    idealFor: ["Decision makers", "People who feel busy but unproductive", "Those who say yes to everything"],
    videoDescription: "The decision matrix that helped run a country — and can run your day",
    onboardingHook: "Busy all day but nothing important gets done?",
  },
  time_blocking: {
    id: "time_blocking",
    name: "Time Blocking",
    tagline: "If it's not on your calendar, it doesn't get done.",
    description: "Assign every hour of your day to specific tasks or categories. No more wondering what to work on next. Your calendar becomes your productivity operating system. Guard your blocks like meetings with yourself.",
    icon: "CalendarBlank",
    color: "#7048e8",
    colorLight: "#e5dbff",
    creator: "Cal Newport / Elon Musk",
    keyBenefit: "Eliminates decision fatigue by pre-deciding your day",
    idealFor: ["People with flexible schedules", "Those who waste time deciding what to do", "Remote workers"],
    videoDescription: "How billionaires structure every hour — and how you can too",
    onboardingHook: "Where did the day go? Time blocking tells you.",
  },
  pareto: {
    id: "pareto",
    name: "80/20 Rule (Pareto)",
    tagline: "80% of results come from 20% of effort. Find your 20%.",
    description: "Identify the vital few activities that generate the majority of your results. Double down on high-impact work. Eliminate or minimize everything else. Work smarter by focusing on leverage, not effort.",
    icon: "ChartBar",
    color: "#e8590c",
    colorLight: "#ffe8cc",
    creator: "Vilfredo Pareto",
    keyBenefit: "Maximizes output per unit of time invested",
    idealFor: ["Entrepreneurs", "People who work hard but spin their wheels", "Anyone seeking leverage"],
    videoDescription: "Find the 20% of your work that creates 80% of your value",
    onboardingHook: "Working hard but not getting proportional results?",
  },
  deep_work: {
    id: "deep_work",
    name: "Deep Work",
    tagline: "Distraction-free focus on cognitively demanding tasks.",
    description: "Extended periods (60-120 min) of uninterrupted, cognitively demanding work. Eliminate all distractions. Train your brain to sustain intense concentration. This is where breakthroughs happen.",
    icon: "Brain",
    color: "#0c8599",
    colorLight: "#c3fae8",
    creator: "Cal Newport",
    keyBenefit: "Produces high-quality work that shallow work can't match",
    idealFor: ["Knowledge workers", "Creators and writers", "Engineers and researchers"],
    videoDescription: "The neuroscience of deep focus and how to train your brain for it",
    onboardingHook: "Constant notifications destroying your best work?",
  },
  eat_the_frog: {
    id: "eat_the_frog",
    name: "Eat The Frog",
    tagline: "Do the hardest thing first. Everything else is easy.",
    description: "Identify the most challenging, most important task of your day — your 'frog' — and do it FIRST. Before email. Before meetings. Before anything comfortable. This builds discipline and ensures your highest-value work gets done.",
    icon: "FrogFace",
    color: "#66a80f",
    colorLight: "#d8f5a2",
    creator: "Brian Tracy / Mark Twain",
    keyBenefit: "Builds discipline and guarantees your hardest task gets done",
    idealFor: ["Procrastinators", "People who save hard tasks for 'later'", "Those with low morning motivation"],
    videoDescription: "Why eating the frog first thing changes your entire day",
    onboardingHook: "Always putting off the hard stuff until 'later'?",
  },
  two_minute: {
    id: "two_minute",
    name: "Two-Minute Rule",
    tagline: "If it takes less than two minutes, do it now.",
    description: "Any task that takes under 2 minutes should be done immediately rather than tracked, scheduled, or deferred. The overhead of managing it exceeds the time to complete it. Keep your system clean.",
    icon: "Lightning",
    color: "#f08c00",
    colorLight: "#fff3bf",
    creator: "David Allen",
    keyBenefit: "Prevents small tasks from piling up and creating overwhelm",
    idealFor: ["People with overflowing to-do lists", "Those who overthink small tasks", "Email heavy workers"],
    videoDescription: "The deceptively simple rule that eliminates task pile-up",
    onboardingHook: "Tiny tasks piling up into a mountain of overwhelm?",
  },
  batch: {
    id: "batch",
    name: "Batch Processing",
    tagline: "Group similar tasks. Eliminate context switching.",
    description: "Instead of switching between different types of tasks throughout the day, group similar tasks into dedicated sessions. Emails in one block. Calls in another. Reports together. Reduce the cognitive cost of context switching.",
    icon: "SquaresFour",
    color: "#9c36b5",
    colorLight: "#f3d9fa",
    creator: "Various",
    keyBenefit: "Reduces context-switching overhead by 40%+",
    idealFor: ["People who multitask", "Those with many similar recurring tasks", "Anyone who feels scattered"],
    videoDescription: "How batch processing saves hours by eliminating the hidden cost of switching",
    onboardingHook: "Jumping between tasks all day and finishing nothing?",
  },
  time_audit: {
    id: "time_audit",
    name: "Time Audit",
    tagline: "You can't manage what you don't measure.",
    description: "Track exactly how you spend every hour for at least 2 weeks. Compare perception vs reality. Discover hidden time sinks. Use data to make informed decisions about where your time goes. What gets measured gets managed.",
    icon: "ClockClockwise",
    color: "#495057",
    colorLight: "#e9ecef",
    creator: "Peter Drucker",
    keyBenefit: "Reveals the truth about where your time actually goes",
    idealFor: ["People who feel time-poor", "Those who want data-driven improvement", "Anyone who says 'where did the day go?'"],
    videoDescription: "The eye-opening exercise that reveals your true time allocation",
    onboardingHook: "Think you know where your time goes? The data will surprise you.",
  },
};

// ============================================================================
// 17. NOTIFICATION DELIVERY STRATEGY
// ============================================================================

export interface DeliveryStrategy {
  maxPerHour: Record<"aggressive" | "moderate" | "minimal", number>;
  maxPerDay: Record<"aggressive" | "moderate" | "minimal", number>;
  channelPriority: Record<CoachingPriority, CoachingChannel[]>;
  quietHoursExceptions: CoachingPriority[];
}

export const DELIVERY_STRATEGY: DeliveryStrategy = {
  maxPerHour: { aggressive: 6, moderate: 3, minimal: 1 },
  maxPerDay: { aggressive: 30, moderate: 15, minimal: 5 },
  channelPriority: {
    low: ["in_app"],
    medium: ["in_app", "push"],
    high: ["push", "in_app"],
    critical: ["push", "in_app", "email"],
  },
  quietHoursExceptions: ["critical"],
};

// ============================================================================
// 18. MILESTONES
// ============================================================================

export interface MilestoneDef {
  key: string;
  label: string;
  description: string;
  threshold: number;
  field: string;
  methodology?: MethodologyId;
  icon: string;
}

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
