/**
 * FlowState Pro — Inngest Functions Specification
 * All background jobs, scheduled tasks, and event-driven workflows.
 *
 * These functions power the 24/7 coaching intelligence layer.
 * They run on Inngest Cloud, triggered by events or cron schedules.
 */

// ============================================================================
// INNGEST CLIENT
// ============================================================================

/*
import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "flowstate-pro",
  schemas: new EventSchemas().fromRecord<FlowStateEvents>(),
});
*/

// ============================================================================
// EVENT DEFINITIONS
// ============================================================================

/**
 * All events that flow through the Inngest system.
 * Strongly typed — every event has a defined payload.
 */
type FlowStateEvents = {
  // Session lifecycle
  "session/started": {
    data: {
      userId: string;
      sessionId: string;
      methodology: string;
      sessionType: string;
      plannedDuration: number; // seconds
    };
  };
  "session/completed": {
    data: {
      userId: string;
      sessionId: string;
      methodology: string;
      sessionType: string;
      actualDuration: number;
      focusRating?: number;
      distractionCount?: number;
      tasksCompleted?: number;
      pomodoroCycle?: number;
    };
  };
  "session/abandoned": {
    data: {
      userId: string;
      sessionId: string;
      methodology: string;
      reason?: string;
      elapsedSeconds: number;
    };
  };

  // Task lifecycle
  "task/created": {
    data: {
      userId: string;
      taskId: string;
      title: string;
      estimatedMinutes?: number;
      isTwoMinute: boolean;
      batchCategory?: string;
    };
  };
  "task/completed": {
    data: {
      userId: string;
      taskId: string;
      isFrog: boolean;
      methodology?: string;
    };
  };
  "task/deferred": {
    data: {
      userId: string;
      taskId: string;
      title: string;
      isTwoMinute: boolean;
      deferCount: number;
    };
  };

  // Timer events
  "timer/five_minutes_remaining": {
    data: {
      userId: string;
      sessionId: string;
      methodology: string;
    };
  };

  // Methodology events
  "methodology/selected": {
    data: {
      userId: string;
      methodology: string;
    };
  };
  "methodology/unlock_ready": {
    data: {
      userId: string;
      currentMethodology: string;
      unlockedMethodology: string;
      unlockedMethodologySlug: string;
    };
  };

  // Video events
  "video/progress_updated": {
    data: {
      userId: string;
      methodology: string;
      muxAssetId: string;
      watchPercentage: number;
    };
  };

  // Analytics events
  "analytics/milestone_reached": {
    data: {
      userId: string;
      milestone: string;
      description: string;
      value: number;
    };
  };
};

// ============================================================================
// INNGEST FUNCTIONS
// ============================================================================

/**
 * 1. TIMER COMPLETION WORKFLOW
 *
 * Triggered when any focus/break session completes.
 * Orchestrates: logging, stats update, unlock check, streak calc, next nudge.
 */
const timerCompletion = {
  id: "timer-completion",
  trigger: { event: "session/completed" },
  steps: [
    {
      name: "update-methodology-stats",
      description:
        "Increment total_sessions, total_minutes, update last_session_at on methodology_progress",
    },
    {
      name: "update-daily-analytics",
      description:
        "Upsert daily_analytics row for today with new session data",
    },
    {
      name: "calculate-mastery-score",
      description:
        "Recalculate mastery_score based on sessions, streak, consistency, focus ratings",
    },
    {
      name: "check-unlock-criteria",
      description:
        "Evaluate if user qualifies for next methodology unlock. If yes, emit methodology/unlock_ready event",
    },
    {
      name: "update-streak",
      description:
        "If first session of the day, increment streak. Update streak_last_active. Check if new longest streak.",
    },
    {
      name: "check-milestones",
      description:
        "Check if user hit any milestones (10 sessions, 100 sessions, 1000 focus minutes, etc). Emit analytics/milestone_reached if so.",
    },
    {
      name: "schedule-next-nudge",
      description:
        "Based on session type, schedule the appropriate next coaching message (e.g., break reminder after focus, focus reminder after break)",
    },
  ],
};

/**
 * 2. DAILY COACHING DIGEST
 *
 * Cron: runs at each user's configured morning_brief_time.
 * Implementation: runs every 15 minutes, queries users whose brief time matches.
 */
const dailyCoachingDigest = {
  id: "daily-coaching-digest",
  trigger: { cron: "*/15 * * * *" }, // Every 15 minutes
  steps: [
    {
      name: "find-users-due-for-brief",
      description:
        "Query users where morning_brief_time matches current 15-min window, adjusted for timezone",
    },
    {
      name: "for-each-user",
      description: "Fan out to per-user briefing generation",
      substeps: [
        {
          name: "gather-context",
          description:
            "Load: yesterday's daily_analytics, today's time_blocks, today's frog task, unprocessed GTD inbox, current streak, active methodology settings",
        },
        {
          name: "generate-briefing",
          description:
            "Call Anthropic Claude API with buildDailyBriefingPrompt() and gathered context. Stream response.",
        },
        {
          name: "deliver-message",
          description:
            "Insert coaching_message (type: daily_brief). Send via push notification. Queue email if user has email_digest enabled.",
        },
      ],
    },
  ],
};

/**
 * 3. WEEKLY REVIEW COMPILATION
 *
 * Cron: runs at each user's configured weekly_review_day.
 * Generates comprehensive weekly report with AI insights.
 */
const weeklyReviewCompile = {
  id: "weekly-review-compile",
  trigger: { cron: "0 */1 * * 0" }, // Every hour on Sundays (timezone-adjusted per user)
  steps: [
    {
      name: "find-users-due-for-review",
      description:
        "Query users where weekly_review_day matches today and review time matches current hour",
    },
    {
      name: "for-each-user",
      description: "Fan out to per-user review compilation",
      substeps: [
        {
          name: "aggregate-weekly-data",
          description: `
            Aggregate from daily_analytics for the past 7 days:
            - Total focus minutes, sessions, tasks completed
            - Methodology breakdown (time per technique)
            - Pomodoro count, deep work hours
            - Frog eaten rate
            - Time block adherence average
            - Eisenhower quadrant distribution
            - Streak status
          `,
        },
        {
          name: "run-pareto-analysis",
          description:
            "Analyze tasks completed vs time spent to identify top 20% activities by impact",
        },
        {
          name: "compare-planned-vs-actual",
          description:
            "Cross-reference time_blocks with time_entries to calculate planned vs actual time distribution",
        },
        {
          name: "generate-ai-insights",
          description: `
            Call Anthropic Claude API with weekly data to generate:
            - 3 key insights about the user's week
            - 1 specific recommendation for next week
            - Methodology-specific feedback
            - Cross-methodology connection insights
          `,
        },
        {
          name: "upsert-weekly-analytics",
          description:
            "Write aggregated data + AI insights to weekly_analytics table",
        },
        {
          name: "deliver-review",
          description:
            "Send coaching_message (type: weekly_review) via in_app + email with full report link",
        },
      ],
    },
  ],
};

/**
 * 4. PROGRESSIVE UNLOCK EVALUATION
 *
 * Triggered by session/completed events when mastery thresholds are approached.
 * Evaluates full unlock criteria for the next methodology in the progression tree.
 */
const progressiveUnlock = {
  id: "progressive-unlock",
  trigger: { event: "session/completed" },
  steps: [
    {
      name: "load-current-progress",
      description:
        "Get user's methodology_progress for their active methodology",
    },
    {
      name: "check-unlock-threshold",
      description: `
        Compare current stats against UNLOCK_CRITERIA:
        - minDaysActive: count distinct days with sessions
        - minSessions: total_sessions on methodology_progress
        - minMasteryScore: current mastery_score
        - additionalConditions: methodology-specific checks
      `,
    },
    {
      name: "determine-next-methodology",
      description:
        "Look up progression map to find next recommended methodology",
    },
    {
      name: "unlock-if-qualified",
      description: `
        If all criteria met:
        1. Update methodology_progress for next methodology: status = 'available', unlocked_at = now()
        2. Emit methodology/unlock_ready event
        3. Log to audit_log
      `,
    },
  ],
};

/**
 * 5. ANALYTICS AGGREGATION (Daily)
 *
 * Cron: runs daily at 00:05 UTC.
 * Rolls up raw session/task/time_entry data into daily_analytics.
 */
const analyticsAggregate = {
  id: "analytics-aggregate-daily",
  trigger: { cron: "5 0 * * *" }, // 00:05 UTC daily
  steps: [
    {
      name: "find-users-with-activity",
      description:
        "Query distinct user_ids from sessions + tasks + time_entries for yesterday",
    },
    {
      name: "for-each-user",
      description: "Fan out to per-user aggregation",
      substeps: [
        {
          name: "aggregate-sessions",
          description: `
            SELECT methodology, session_type, status, 
              SUM(actual_duration), COUNT(*), AVG(focus_rating), AVG(energy_level),
              SUM(distraction_count), SUM(tasks_completed_count)
            FROM sessions WHERE user_id = $1 AND DATE(started_at) = yesterday
            GROUP BY methodology, session_type, status
          `,
        },
        {
          name: "aggregate-tasks",
          description: `
            Count tasks created, tasks completed, frog status,
            two-minute tasks cleared, batch sessions
          `,
        },
        {
          name: "aggregate-time-entries",
          description: `
            Sum time per eisenhower quadrant from time_entries
            joined with tasks on task_id
          `,
        },
        {
          name: "calculate-time-block-adherence",
          description: `
            Compare time_blocks (planned) with actual session/time_entry data
            to calculate adherence percentage
          `,
        },
        {
          name: "find-most-productive-hour",
          description: `
            From sessions completed yesterday, find the hour
            with highest average focus_rating
          `,
        },
        {
          name: "upsert-daily-analytics",
          description: "Write all aggregated data to daily_analytics table",
        },
      ],
    },
  ],
};

/**
 * 6. WEEKLY ANALYTICS AGGREGATION
 *
 * Cron: runs Monday 00:10 UTC.
 * Rolls up daily_analytics into weekly_analytics.
 */
const weeklyAnalyticsAggregate = {
  id: "analytics-aggregate-weekly",
  trigger: { cron: "10 0 * * 1" }, // Monday 00:10 UTC
  steps: [
    {
      name: "find-users-with-weekly-data",
      description:
        "Query distinct user_ids from daily_analytics for past 7 days",
    },
    {
      name: "for-each-user",
      description: "Aggregate 7 daily_analytics rows into 1 weekly row",
    },
  ],
};

/**
 * 7. STREAK CALCULATOR
 *
 * Cron: daily at 00:15 UTC.
 * Calculates streaks and sends streak-at-risk notifications.
 */
const streakCalculator = {
  id: "streak-calculator",
  trigger: { cron: "15 0 * * *" }, // 00:15 UTC daily
  steps: [
    {
      name: "find-users-with-active-streaks",
      description:
        "Query users where streak_current > 0",
    },
    {
      name: "for-each-user",
      description: "Check if user had activity yesterday",
      substeps: [
        {
          name: "check-yesterday-activity",
          description: `
            If user has a session completed yesterday:
              - streak continues (already incremented during session)
            If no activity yesterday:
              - Reset streak_current to 0
              - Log streak break to coaching_messages
          `,
        },
      ],
    },
  ],
};

/**
 * 8. MORNING FROG REMINDER
 *
 * Cron: every 15 minutes.
 * Checks users whose morning_brief_time + 30min matches current time.
 * If frog is set but not started, sends reminder.
 */
const morningFrogReminder = {
  id: "morning-frog-reminder",
  trigger: { cron: "*/15 * * * *" },
  steps: [
    {
      name: "find-users-with-uneaten-frogs",
      description: `
        Query users where:
        - active_methodology includes eat_the_frog (or it's their active technique)
        - frog task exists for today (tasks WHERE is_frog = true AND frog_date = today)
        - frog task status is NOT 'completed' or 'active'
        - current time is 30min past their morning_brief_time
      `,
    },
    {
      name: "send-frog-reminder",
      description:
        "Deliver EAT_THE_FROG_TRIGGERS.morning nudge via push + in_app",
    },
  ],
};

/**
 * 9. TIME BLOCK UPCOMING NOTIFICATION
 *
 * Cron: every 5 minutes.
 * Sends prep notifications for time blocks starting in 5 minutes.
 */
const timeBlockUpcoming = {
  id: "time-block-upcoming",
  trigger: { cron: "*/5 * * * *" },
  steps: [
    {
      name: "find-upcoming-blocks",
      description: `
        Query time_blocks where:
        - date = today
        - start_time BETWEEN now() AND now() + 5 minutes (adjusted for user timezone)
        - deleted_at IS NULL
      `,
    },
    {
      name: "for-each-block",
      description:
        "Send TIME_BLOCKING_TRIGGERS.upcoming_block nudge to block owner",
    },
  ],
};

/**
 * 10. GTD INBOX REVIEW REMINDER
 *
 * Cron: every hour during business hours.
 * Nudges users with >5 unprocessed inbox items.
 */
const gtdInboxReview = {
  id: "gtd-inbox-review",
  trigger: { cron: "0 9-17 * * 1-5" }, // Hourly 9am-5pm weekdays
  steps: [
    {
      name: "find-users-with-full-inboxes",
      description: `
        Query users where:
        - methodology_progress for 'gtd' has status IN ('active', 'mastered')
        - COUNT(tasks WHERE gtd_status = 'inbox' AND status = 'inbox') > 5
      `,
    },
    {
      name: "send-inbox-nudge",
      description:
        "Deliver GTD_TRIGGERS.inbox_pileup nudge (respecting cooldown and quiet hours)",
    },
  ],
};

/**
 * 11. DEEP WORK SESSION PREP
 *
 * Cron: every 5 minutes.
 * Sends preparation notification 10 minutes before scheduled deep work.
 */
const deepWorkSessionPrep = {
  id: "deep-work-session-prep",
  trigger: { cron: "*/5 * * * *" },
  steps: [
    {
      name: "find-upcoming-deep-work",
      description: `
        Query time_blocks where:
        - methodology = 'deep_work'
        - date = today
        - start_time BETWEEN now() + 5min AND now() + 15min
      `,
    },
    {
      name: "send-prep-notification",
      description:
        "Deliver DEEP_WORK_TRIGGERS.session_prep nudge",
    },
  ],
};

/**
 * 12. BATCH SUGGESTION ENGINE
 *
 * Triggered when a task is created.
 * Checks if 3+ tasks exist in the same batch_category.
 */
const batchSuggestion = {
  id: "batch-suggestion",
  trigger: { event: "task/created" },
  steps: [
    {
      name: "check-category-count",
      description: `
        If task has batch_category:
        COUNT tasks WHERE user_id = $1 AND batch_category = $2 AND status IN ('inbox', 'active')
      `,
    },
    {
      name: "suggest-if-threshold-met",
      description:
        "If count >= 3, deliver BATCH_TRIGGERS.pattern_detected nudge",
    },
  ],
};

/**
 * 13. PARETO WEEKLY ANALYSIS
 *
 * Cron: Friday at 5pm (adjusted per user timezone).
 * Runs 80/20 analysis on the week's completed tasks.
 */
const paretoWeeklyAnalysis = {
  id: "pareto-weekly-analysis",
  trigger: { cron: "0 17 * * 5" }, // Friday 5pm UTC (timezone-adjusted)
  steps: [
    {
      name: "find-users-with-pareto-active",
      description:
        "Query users where methodology_progress for 'pareto' has status IN ('active', 'mastered')",
    },
    {
      name: "for-each-user",
      description: "Run Pareto analysis",
      substeps: [
        {
          name: "gather-task-data",
          description: `
            Get all tasks completed this week with:
            - impact_score
            - effort_score
            - actual_duration
            - batch_category
          `,
        },
        {
          name: "calculate-pareto",
          description: `
            Sort tasks by impact_score DESC.
            Find the cutoff where top 20% of tasks account for >=80% of total impact.
            Categorize tasks as 'high_impact' or 'low_impact'.
          `,
        },
        {
          name: "deliver-analysis",
          description:
            "Deliver PARETO_TRIGGERS.weekly_analysis with results",
        },
      ],
    },
  ],
};

/**
 * 14. VIDEO COMPLETION CHECK
 *
 * Triggered when video progress is updated.
 * Marks methodology video as complete when 90%+ watched.
 */
const videoCompletionCheck = {
  id: "video-completion-check",
  trigger: { event: "video/progress_updated" },
  steps: [
    {
      name: "check-completion",
      description: `
        If watchPercentage >= 90:
        1. Update video_progress: completed = true, completed_at = now()
        2. Check if this was part of onboarding flow
        3. If all onboarding videos watched, update user.onboarding_completed
      `,
    },
  ],
};

/**
 * 15. EVENING STREAK CHECK
 *
 * Cron: 8pm in each user's timezone.
 * Warns users with active streaks who haven't logged a session today.
 */
const eveningStreakCheck = {
  id: "evening-streak-check",
  trigger: { cron: "*/15 * * * *" }, // Check every 15min for timezone matching
  steps: [
    {
      name: "find-at-risk-users",
      description: `
        Query users where:
        - streak_current >= 3
        - No sessions with started_at = today
        - Current time in user's timezone is between 8pm and 9pm
      `,
    },
    {
      name: "send-streak-warning",
      description:
        "Deliver CROSS_METHODOLOGY_TRIGGERS.streak_at_risk nudge",
    },
  ],
};

// ============================================================================
// MILESTONES DEFINITION
// ============================================================================

const MILESTONES = [
  // Session milestones
  { key: "sessions_10", label: "10 Sessions Complete", threshold: 10, field: "total_sessions" },
  { key: "sessions_50", label: "50 Sessions Complete", threshold: 50, field: "total_sessions" },
  { key: "sessions_100", label: "Century Club: 100 Sessions", threshold: 100, field: "total_sessions" },
  { key: "sessions_500", label: "500 Sessions — Elite Focus", threshold: 500, field: "total_sessions" },
  { key: "sessions_1000", label: "1,000 Sessions — Legendary", threshold: 1000, field: "total_sessions" },

  // Focus time milestones
  { key: "focus_60", label: "First Hour of Focus", threshold: 60, field: "total_focus_minutes" },
  { key: "focus_600", label: "10 Hours of Focus", threshold: 600, field: "total_focus_minutes" },
  { key: "focus_3000", label: "50 Hours of Deep Focus", threshold: 3000, field: "total_focus_minutes" },
  { key: "focus_6000", label: "100 Hours — Master Practitioner", threshold: 6000, field: "total_focus_minutes" },

  // Streak milestones
  { key: "streak_7", label: "7-Day Streak 🔥", threshold: 7, field: "streak_current" },
  { key: "streak_14", label: "14-Day Streak 🔥🔥", threshold: 14, field: "streak_current" },
  { key: "streak_30", label: "30-Day Streak — Habit Formed", threshold: 30, field: "streak_current" },
  { key: "streak_60", label: "60-Day Streak — Unstoppable", threshold: 60, field: "streak_current" },
  { key: "streak_100", label: "100-Day Streak — Legend", threshold: 100, field: "streak_current" },
  { key: "streak_365", label: "365-Day Streak — One Full Year", threshold: 365, field: "streak_current" },

  // Methodology milestones
  { key: "methods_2", label: "Second Technique Activated", threshold: 2, field: "active_methodologies" },
  { key: "methods_5", label: "5 Techniques in Your Arsenal", threshold: 5, field: "active_methodologies" },
  { key: "methods_10", label: "Complete System — All 10 Mastered", threshold: 10, field: "mastered_methodologies" },

  // Specific achievement milestones
  { key: "frogs_eaten_30", label: "30 Frogs Eaten — Morning Warrior", threshold: 30, field: "frogs_eaten" },
  { key: "pomodoros_100", label: "100 Pomodoros — Focus Machine", threshold: 100, field: "pomodoros_completed" },
  { key: "deep_work_50h", label: "50 Hours of Deep Work", threshold: 3000, field: "deep_work_minutes" },
  { key: "tasks_completed_100", label: "100 Tasks Completed", threshold: 100, field: "tasks_completed" },
  { key: "tasks_completed_1000", label: "1,000 Tasks — Execution Machine", threshold: 1000, field: "tasks_completed" },
];

export {
  timerCompletion,
  dailyCoachingDigest,
  weeklyReviewCompile,
  progressiveUnlock,
  analyticsAggregate,
  weeklyAnalyticsAggregate,
  streakCalculator,
  morningFrogReminder,
  timeBlockUpcoming,
  gtdInboxReview,
  deepWorkSessionPrep,
  batchSuggestion,
  paretoWeeklyAnalysis,
  videoCompletionCheck,
  eveningStreakCheck,
  MILESTONES,
};

export type { FlowStateEvents };
