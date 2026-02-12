import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { methodologyEnum, sessionStatusEnum, sessionTypeEnum } from "./enums";
import { users } from "./users";
import { tasks } from "./tasks";

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    methodology: methodologyEnum("methodology").notNull(),
    sessionType: sessionTypeEnum("session_type").notNull(),
    status: sessionStatusEnum("status").default("planned"),

    // Timing
    plannedDuration: integer("planned_duration").notNull(), // seconds
    actualDuration: integer("actual_duration"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    pausedAt: timestamp("paused_at", { withTimezone: true }),
    totalPauseDuration: integer("total_pause_duration").default(0),

    // Pomodoro-specific
    pomodoroCycle: smallint("pomodoro_cycle"),
    pomodoroSet: smallint("pomodoro_set"),

    // Deep Work-specific
    distractionCount: integer("distraction_count").default(0),
    distractionLog: jsonb("distraction_log")
      .default([])
      .$type<
        Array<{
          timestamp: string;
          description: string;
          duration_seconds: number;
        }>
      >(),

    // Batch-specific
    batchCategory: varchar("batch_category", { length: 100 }),
    tasksCompletedCount: integer("tasks_completed_count").default(0),

    // Quality metrics
    focusRating: smallint("focus_rating"),
    energyLevel: smallint("energy_level"),
    notes: text("notes"),

    // Linked entities
    taskId: uuid("task_id").references(() => tasks.id),
    timeBlockId: uuid("time_block_id"),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_sessions_user_methodology").on(
      table.userId,
      table.methodology
    ),
    index("idx_sessions_user_date").on(table.userId, table.startedAt),
    index("idx_sessions_active")
      .on(table.userId, table.status)
      .where(sql`status IN ('active', 'paused')`),
    index("idx_sessions_completed")
      .on(table.userId, table.methodology, table.endedAt)
      .where(sql`status = 'completed'`),
  ]
);

export const sessionTasks = pgTable(
  "session_tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id")
      .references(() => sessions.id, { onDelete: "cascade" })
      .notNull(),
    taskId: uuid("task_id")
      .references(() => tasks.id, { onDelete: "cascade" })
      .notNull(),
    completedInSession: boolean("completed_in_session").default(false),
    timeSpent: integer("time_spent"), // seconds
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex("uq_session_tasks").on(table.sessionId, table.taskId),
  ]
);
