import {
  boolean,
  date,
  index,
  integer,
  interval,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import {
  eisenhowerQuadrantEnum,
  gtdStatusEnum,
  paretoCategory,
  taskPriorityEnum,
  taskStatusEnum,
} from "./enums";
import { users } from "./users";
import { gtdProjects } from "./gtd";

export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    title: varchar("title", { length: 500 }).notNull(),
    description: text("description"),
    status: taskStatusEnum("status").default("inbox"),
    priority: taskPriorityEnum("priority").default("none"),

    // Eisenhower Matrix
    eisenhowerQuadrant: eisenhowerQuadrantEnum("eisenhower_quadrant"),
    urgencyScore: smallint("urgency_score"),
    importanceScore: smallint("importance_score"),

    // GTD
    gtdStatus: gtdStatusEnum("gtd_status"),
    gtdContext: varchar("gtd_context", { length: 100 }),
    gtdProjectId: uuid("gtd_project_id").references(() => gtdProjects.id, {
      onDelete: "set null",
    }),
    gtdWaitingFor: varchar("gtd_waiting_for", { length: 255 }),
    gtdDelegatedTo: varchar("gtd_delegated_to", { length: 255 }),
    gtdWaitingSince: date("gtd_waiting_since"),

    // Eat The Frog
    isFrog: boolean("is_frog").default(false).notNull(),
    frogDate: date("frog_date"),
    frogCompletedAt: timestamp("frog_completed_at", { withTimezone: true }),

    // Two-Minute Rule
    estimatedMinutes: smallint("estimated_minutes"),
    isTwoMinute: boolean("is_two_minute").default(false).notNull(),
    deferCount: integer("defer_count").default(0).notNull(),

    // Batch Processing
    batchCategory: varchar("batch_category", { length: 100 }),
    batchSessionId: uuid("batch_session_id"),

    // Time Tracking
    estimatedDuration: interval("estimated_duration"),
    actualDuration: interval("actual_duration"),
    timeBlockId: uuid("time_block_id"),

    // Pareto / Impact
    impactScore: smallint("impact_score"),
    effortScore: smallint("effort_score"),
    paretoCategory: paretoCategory("pareto_category"),
    impactNotes: text("impact_notes"),

    // Metadata
    tags: text("tags").array().default([]),
    dueDate: date("due_date"),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    sortOrder: integer("sort_order").default(0).notNull(),
    recurrenceRule: varchar("recurrence_rule", { length: 255 }),
    parentTaskId: uuid("parent_task_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("idx_tasks_user_status").on(table.userId, table.status),
    index("idx_tasks_user_eisenhower").on(table.userId, table.eisenhowerQuadrant),
    index("idx_tasks_user_gtd").on(table.userId, table.gtdStatus),
    index("idx_tasks_user_frog").on(table.userId, table.frogDate),
    index("idx_tasks_user_batch").on(table.userId, table.batchCategory),
    index("idx_tasks_user_due").on(table.userId, table.dueDate),
    index("idx_tasks_parent").on(table.parentTaskId),
    index("idx_tasks_two_minute").on(table.userId, table.isTwoMinute),
    index("idx_tasks_pareto").on(table.userId, table.paretoCategory),
    index("idx_tasks_user_priority").on(table.userId, table.priority),
  ]
);
