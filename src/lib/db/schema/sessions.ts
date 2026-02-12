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
    plannedDurationSeconds: integer("planned_duration_seconds").notNull(),
    actualDurationSeconds: integer("actual_duration_seconds"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    pausedAt: timestamp("paused_at", { withTimezone: true }),
    totalPauseSeconds: integer("total_pause_seconds").default(0).notNull(),

    // Pomodoro-specific
    pomodoroCycle: smallint("pomodoro_cycle"),
    pomodoroSet: smallint("pomodoro_set"),

    // Deep Work-specific
    distractionCount: integer("distraction_count").default(0).notNull(),
    distractionLog: jsonb("distraction_log")
      .default([])
      .$type<
        Array<{
          timestamp: string;
          description: string;
          duration_seconds: number;
          category: string;
        }>
      >()
      .notNull(),

    // Batch-specific
    batchCategory: varchar("batch_category", { length: 100 }),
    tasksCompletedCount: integer("tasks_completed_count").default(0).notNull(),

    // Quality metrics
    focusRating: smallint("focus_rating"),
    energyLevelBefore: smallint("energy_level_before"),
    energyLevelAfter: smallint("energy_level_after"),
    notes: text("notes"),
    abandonReason: text("abandon_reason"),

    // Linked entities
    taskId: uuid("task_id").references(() => tasks.id, { onDelete: "set null" }),
    timeBlockId: uuid("time_block_id"),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
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
    index("idx_sessions_completed").on(table.userId, table.methodology, table.endedAt),
    index("idx_sessions_type").on(table.userId, table.sessionType),
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
    completedInSession: boolean("completed_in_session").default(false).notNull(),
    timeSpentSeconds: integer("time_spent_seconds"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("uq_session_tasks").on(table.sessionId, table.taskId),
  ]
);
