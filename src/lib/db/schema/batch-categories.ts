import {
  integer,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { users } from "./users";

export const batchCategories = pgTable(
  "batch_categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    icon: varchar("icon", { length: 50 }),
    color: varchar("color", { length: 7 }),
    avgTaskDuration: integer("avg_task_duration_seconds"),
    totalTasksCompleted: integer("total_tasks_completed").default(0).notNull(),
    totalBatchSessions: integer("total_batch_sessions").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("uq_batch_categories_user_name").on(table.userId, table.name),
  ]
);
