import {
  boolean,
  index,
  integer,
  pgTable,
  smallint,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { timeEntrySourceEnum } from "./enums";
import { users } from "./users";
import { tasks } from "./tasks";
import { sessions } from "./sessions";
import { timeBlocks } from "./time-blocks";

export const timeEntries = pgTable(
  "time_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    category: varchar("category", { length: 100 }).notNull(),
    subcategory: varchar("subcategory", { length: 100 }),
    description: varchar("description", { length: 500 }),
    source: timeEntrySourceEnum("source").default("manual"),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    duration: integer("duration"), // seconds
    isProductive: boolean("is_productive"),
    productivityScore: smallint("productivity_score"),
    taskId: uuid("task_id").references(() => tasks.id),
    sessionId: uuid("session_id").references(() => sessions.id),
    timeBlockId: uuid("time_block_id").references(() => timeBlocks.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_time_entries_user_date").on(table.userId, table.startedAt),
    index("idx_time_entries_user_category").on(table.userId, table.category),
    index("idx_time_entries_user_productive").on(
      table.userId,
      table.isProductive,
      table.startedAt
    ),
  ]
);
