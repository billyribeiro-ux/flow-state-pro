import {
  boolean,
  date,
  decimal,
  index,
  integer,
  jsonb,
  pgTable,
  smallint,
  text,
  time,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { users } from "./users";

export const dailyAnalytics = pgTable(
  "daily_analytics",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    date: date("date").notNull(),

    // Session metrics
    totalFocusMinutes: integer("total_focus_minutes").default(0).notNull(),
    totalBreakMinutes: integer("total_break_minutes").default(0).notNull(),
    sessionsCompleted: integer("sessions_completed").default(0).notNull(),
    sessionsAbandoned: integer("sessions_abandoned").default(0).notNull(),

    // Task metrics
    tasksCompleted: integer("tasks_completed").default(0).notNull(),
    tasksCreated: integer("tasks_created").default(0).notNull(),

    // Pomodoro
    pomodorosCompleted: integer("pomodoros_completed").default(0).notNull(),
    pomodoroSetsCompleted: integer("pomodoro_sets_completed").default(0).notNull(),
    avgPomodoroFocusRating: decimal("avg_pomodoro_focus_rating", { precision: 3, scale: 2 }),

    // Deep Work
    deepWorkMinutes: integer("deep_work_minutes").default(0).notNull(),
    deepWorkSessions: integer("deep_work_sessions").default(0).notNull(),
    distractionCount: integer("distraction_count").default(0).notNull(),

    // Eat The Frog
    frogEaten: boolean("frog_eaten").default(false).notNull(),
    frogEatenTime: time("frog_eaten_time"),
    frogEatenBeforeNoon: boolean("frog_eaten_before_noon").default(false).notNull(),

    // Two-Minute Rule
    twoMinuteTasksCleared: integer("two_minute_tasks_cleared").default(0).notNull(),
    twoMinuteTasksDeferred: integer("two_minute_tasks_deferred").default(0).notNull(),

    // Batch Processing
    batchSessionsCompleted: integer("batch_sessions_completed").default(0).notNull(),
    batchTasksCompleted: integer("batch_tasks_completed").default(0).notNull(),

    // Time Blocking
    timeBlockAdherence: decimal("time_block_adherence", { precision: 5, scale: 2 }),
    timeBlocksPlanned: integer("time_blocks_planned").default(0).notNull(),
    timeBlocksCompleted: integer("time_blocks_completed").default(0).notNull(),
    timeBlockOverrunMinutes: integer("time_block_overrun_minutes").default(0).notNull(),

    // Eisenhower
    eisenhowerQ1Time: integer("eisenhower_q1_time").default(0).notNull(),
    eisenhowerQ2Time: integer("eisenhower_q2_time").default(0).notNull(),
    eisenhowerQ3Time: integer("eisenhower_q3_time").default(0).notNull(),
    eisenhowerQ4Time: integer("eisenhower_q4_time").default(0).notNull(),
    eisenhowerTasksSorted: integer("eisenhower_tasks_sorted").default(0).notNull(),

    // GTD
    gtdInboxItemsProcessed: integer("gtd_inbox_items_processed").default(0).notNull(),
    gtdInboxEndOfDay: integer("gtd_inbox_end_of_day").default(0).notNull(),
    gtdNextActionsCompleted: integer("gtd_next_actions_completed").default(0).notNull(),
    gtdWeeklyReviewCompleted: boolean("gtd_weekly_review_completed").default(false).notNull(),

    // Pareto
    paretoHighImpactMinutes: integer("pareto_high_impact_minutes").default(0).notNull(),
    paretoLowImpactMinutes: integer("pareto_low_impact_minutes").default(0).notNull(),

    // Time Audit
    timeAuditTrackedMinutes: integer("time_audit_tracked_minutes").default(0).notNull(),
    timeAuditProductiveMinutes: integer("time_audit_productive_minutes").default(0).notNull(),
    timeAuditUnproductiveMinutes: integer("time_audit_unproductive_minutes").default(0).notNull(),

    // General metrics
    mostProductiveHour: smallint("most_productive_hour"),
    energyAvg: decimal("energy_avg", { precision: 3, scale: 2 }),
    focusRatingAvg: decimal("focus_rating_avg", { precision: 3, scale: 2 }),
    streakDay: integer("streak_day").default(0).notNull(),
    methodologiesUsed: text("methodologies_used").array().default([]).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("uq_daily_analytics").on(table.userId, table.date),
    index("idx_daily_analytics_user_date").on(table.userId, table.date),
  ]
);

export const weeklyAnalytics = pgTable(
  "weekly_analytics",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    weekStart: date("week_start").notNull(),
    totalFocusMinutes: integer("total_focus_minutes").default(0).notNull(),
    totalSessions: integer("total_sessions").default(0).notNull(),
    tasksCompleted: integer("tasks_completed").default(0).notNull(),

    // Pareto
    paretoTopActivities: jsonb("pareto_top_activities").default([]).notNull()
      .$type<Array<{ category: string; minutes: number; tasks: number; impactScore: number }>>(),
    paretoBottomActivities: jsonb("pareto_bottom_activities").default([]).notNull()
      .$type<Array<{ category: string; minutes: number; tasks: number; impactScore: number }>>(),
    paretoRatio: decimal("pareto_ratio", { precision: 5, scale: 2 }),

    // Time Audit
    timeAuditPlannedVsActual: jsonb("time_audit_planned_vs_actual").default({}).notNull()
      .$type<Record<string, { planned: number; actual: number }>>(),
    timeAuditCategoryBreakdown: jsonb("time_audit_category_breakdown").default({}).notNull()
      .$type<Record<string, number>>(),

    // Methodology breakdown
    methodologyBreakdown: jsonb("methodology_breakdown").default({}).notNull()
      .$type<Record<string, { sessions: number; minutes: number; tasksCompleted: number }>>(),

    // AI insights
    coachingInsights: jsonb("coaching_insights").default([]).notNull()
      .$type<Array<{ type: string; insight: string; methodology?: string; actionable: string }>>(),

    // Scores
    overallProductivityScore: decimal("overall_productivity_score", { precision: 5, scale: 2 }),
    goalsHit: integer("goals_hit").default(0).notNull(),
    goalsMissed: integer("goals_missed").default(0).notNull(),

    // Eisenhower weekly
    eisenhowerDistribution: jsonb("eisenhower_distribution").default({}).notNull()
      .$type<{ q1: number; q2: number; q3: number; q4: number }>(),

    // Streaks
    streakMaintained: boolean("streak_maintained").default(true).notNull(),
    daysActive: integer("days_active").default(0).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("uq_weekly_analytics").on(table.userId, table.weekStart),
    index("idx_weekly_analytics_user").on(table.userId, table.weekStart),
  ]
);
