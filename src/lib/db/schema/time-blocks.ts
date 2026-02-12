import {
  boolean,
  date,
  decimal,
  index,
  integer,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { methodologyEnum, timeBlockTypeEnum } from "./enums";
import { users } from "./users";

export const timeBlocks = pgTable(
  "time_blocks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    blockType: timeBlockTypeEnum("block_type").default("focus").notNull(),
    color: varchar("color", { length: 7 }),
    date: date("date").notNull(),
    startTime: time("start_time").notNull(),
    endTime: time("end_time").notNull(),
    isRecurring: boolean("is_recurring").default(false).notNull(),
    recurrenceRule: varchar("recurrence_rule", { length: 255 }),
    methodology: methodologyEnum("methodology"),
    actualStart: timestamp("actual_start", { withTimezone: true }),
    actualEnd: timestamp("actual_end", { withTimezone: true }),
    adherenceScore: decimal("adherence_score", { precision: 5, scale: 2 }),
    wasCompleted: boolean("was_completed").default(false).notNull(),
    overrunMinutes: integer("overrun_minutes").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("idx_time_blocks_user_date").on(table.userId, table.date),
    index("idx_time_blocks_user_date_range").on(
      table.userId,
      table.date,
      table.startTime,
      table.endTime
    ),
    index("idx_time_blocks_methodology").on(table.userId, table.methodology),
  ]
);
