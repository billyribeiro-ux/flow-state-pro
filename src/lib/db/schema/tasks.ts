import {
  boolean,
  date,
  index,
  integer,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

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
    gtdProjectId: uuid("gtd_project_id").references(() => gtdProjects.id),
    gtdWaitingFor: varchar("gtd_waiting_for", { length: 255 }),
    gtdDelegatedTo: varchar("gtd_delegated_to", { length: 255 }),

    // Eat The Frog
    isFrog: boolean("is_frog").default(false),
    frogDate: date("frog_date"),

    // Two-Minute Rule
    estimatedMinutes: smallint("estimated_minutes"),
    isTwoMinute: boolean("is_two_minute").default(false),

    // Batch Processing
    batchCategory: varchar("batch_category", { length: 100 }),
    batchSessionId: uuid("batch_session_id"),

    // Time Tracking
    estimatedDuration: varchar("estimated_duration", { length: 50 }),
    actualDuration: varchar("actual_duration", { length: 50 }),
    timeBlockId: uuid("time_block_id"),

    // Pareto / Impact
    impactScore: smallint("impact_score"),
    effortScore: smallint("effort_score"),
    paretoCategory: paretoCategory("pareto_category"),

    // Metadata
    tags: text("tags").array().default(sql`'{}'`),
    dueDate: date("due_date"),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    sortOrder: integer("sort_order").default(0),
    recurrenceRule: varchar("recurrence_rule", { length: 255 }),
    parentTaskId: uuid("parent_task_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("idx_tasks_user_status").on(table.userId, table.status),
    index("idx_tasks_user_eisenhower")
      .on(table.userId, table.eisenhowerQuadrant)
      .where(sql`deleted_at IS NULL`),
    index("idx_tasks_user_gtd")
      .on(table.userId, table.gtdStatus)
      .where(sql`deleted_at IS NULL`),
    index("idx_tasks_user_frog")
      .on(table.userId, table.frogDate)
      .where(sql`is_frog = true`),
    index("idx_tasks_user_batch")
      .on(table.userId, table.batchCategory)
      .where(sql`deleted_at IS NULL`),
    index("idx_tasks_user_two_minute")
      .on(table.userId)
      .where(sql`is_two_minute = true AND status = 'active'`),
    index("idx_tasks_due_date")
      .on(table.userId, table.dueDate)
      .where(sql`due_date IS NOT NULL`),
  ]
);
