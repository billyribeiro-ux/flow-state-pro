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
    totalFocusMinutes: integer("total_focus_minutes").default(0),
    totalBreakMinutes: integer("total_break_minutes").default(0),
    sessionsCompleted: integer("sessions_completed").default(0),
    sessionsAbandoned: integer("sessions_abandoned").default(0),
    tasksCompleted: integer("tasks_completed").default(0),
    tasksCreated: integer("tasks_created").default(0),
    pomodorosCompleted: integer("pomodoros_completed").default(0),
    deepWorkMinutes: integer("deep_work_minutes").default(0),
    distractionCount: integer("distraction_count").default(0),
    frogEaten: boolean("frog_eaten").default(false),
    frogEatenTime: time("frog_eaten_time"),
    twoMinuteTasksCleared: integer("two_minute_tasks_cleared").default(0),
    batchSessionsCompleted: integer("batch_sessions_completed").default(0),
    timeBlockAdherence: decimal("time_block_adherence", {
      precision: 5,
      scale: 2,
    }),
    eisenhowerQ1Time: integer("eisenhower_q1_time").default(0),
    eisenhowerQ2Time: integer("eisenhower_q2_time").default(0),
    eisenhowerQ3Time: integer("eisenhower_q3_time").default(0),
    eisenhowerQ4Time: integer("eisenhower_q4_time").default(0),
    mostProductiveHour: smallint("most_productive_hour"),
    energyAvg: decimal("energy_avg", { precision: 3, scale: 2 }),
    focusRatingAvg: decimal("focus_rating_avg", { precision: 3, scale: 2 }),
    streakDay: integer("streak_day").default(0),
    methodologiesUsed: text("methodologies_used").array().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
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
    totalFocusMinutes: integer("total_focus_minutes").default(0),
    totalSessions: integer("total_sessions").default(0),
    tasksCompleted: integer("tasks_completed").default(0),
    paretoTopActivities: jsonb("pareto_top_activities").default([]),
    paretoBottomActivities: jsonb("pareto_bottom_activities").default([]),
    timeAuditPlannedVsActual: jsonb("time_audit_planned_vs_actual").default({}),
    methodologyBreakdown: jsonb("methodology_breakdown").default({}),
    coachingInsights: jsonb("coaching_insights").default([]),
    goalsHit: integer("goals_hit").default(0),
    goalsMissed: integer("goals_missed").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex("uq_weekly_analytics").on(table.userId, table.weekStart),
    index("idx_weekly_analytics_user").on(table.userId, table.weekStart),
  ]
);
