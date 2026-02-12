import {
  boolean,
  index,
  integer,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { methodologyEnum } from "./enums";
import { users } from "./users";

export const milestonesAchieved = pgTable(
  "milestones_achieved",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    milestoneKey: varchar("milestone_key", { length: 100 }).notNull(),
    milestoneLabel: varchar("milestone_label", { length: 255 }).notNull(),
    value: integer("value").notNull(),
    methodology: methodologyEnum("methodology"),
    achievedAt: timestamp("achieved_at", { withTimezone: true }).defaultNow().notNull(),
    celebrationShown: boolean("celebration_shown").default(false).notNull(),
  },
  (table) => [
    uniqueIndex("uq_milestones_user_key").on(table.userId, table.milestoneKey),
    index("idx_milestones_user").on(table.userId),
  ]
);
