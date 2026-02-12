import {
  boolean,
  index,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { methodologyEnum } from "./enums";
import { users } from "./users";

export const userGoals = pgTable(
  "user_goals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    methodology: methodologyEnum("methodology"),
    title: varchar("title", { length: 255 }).notNull(),
    targetType: varchar("target_type", { length: 50 }).notNull(),
    targetValue: integer("target_value").notNull(),
    currentValue: integer("current_value").default(0).notNull(),
    frequency: varchar("frequency", { length: 20 }).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_user_goals_user").on(table.userId, table.isActive),
  ]
);
