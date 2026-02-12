import {
  boolean,
  decimal,
  index,
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
    status: methodologyStatusEnum("status").default("locked").notNull(),
    unlockedAt: timestamp("unlocked_at", { withTimezone: true }),
    activatedAt: timestamp("activated_at", { withTimezone: true }),
    masteredAt: timestamp("mastered_at", { withTimezone: true }),
    totalSessions: integer("total_sessions").default(0).notNull(),
    totalMinutes: integer("total_minutes").default(0).notNull(),
    currentStreak: integer("current_streak").default(0).notNull(),
    longestStreak: integer("longest_streak").default(0).notNull(),
    masteryScore: decimal("mastery_score", { precision: 5, scale: 2 })
      .default("0.00")
      .notNull(),
    lastSessionAt: timestamp("last_session_at", { withTimezone: true }),
    videoWatched: boolean("video_watched").default(false).notNull(),
    daysActive: integer("days_active").default(0).notNull(),
    settings: jsonb("settings").default({}).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("uq_methodology_progress_user_method").on(
      table.userId,
      table.methodology
    ),
    index("idx_methodology_progress_user").on(table.userId),
    index("idx_methodology_progress_status").on(table.userId, table.status),
  ]
);
