import {
  decimal,
  integer,
  jsonb,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { methodologyEnum, methodologyStatusEnum } from "./enums";
import { users } from "./users";

export const methodologyProgress = pgTable(
  "methodology_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    methodology: methodologyEnum("methodology").notNull(),
    status: methodologyStatusEnum("status").default("locked"),
    unlockedAt: timestamp("unlocked_at", { withTimezone: true }),
    activatedAt: timestamp("activated_at", { withTimezone: true }),
    masteredAt: timestamp("mastered_at", { withTimezone: true }),
    totalSessions: integer("total_sessions").default(0),
    totalMinutes: integer("total_minutes").default(0),
    currentStreak: integer("current_streak").default(0),
    longestStreak: integer("longest_streak").default(0),
    masteryScore: decimal("mastery_score", { precision: 5, scale: 2 }).default(
      "0.00"
    ),
    lastSessionAt: timestamp("last_session_at", { withTimezone: true }),
    settings: jsonb("settings").default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex("uq_methodology_progress").on(
      table.userId,
      table.methodology
    ),
  ]
);
