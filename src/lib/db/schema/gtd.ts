import {
  boolean,
  date,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { gtdProjectStatusEnum } from "./enums";
import { users } from "./users";

export const gtdProjects = pgTable(
  "gtd_projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    title: varchar("title", { length: 500 }).notNull(),
    description: text("description"),
    status: gtdProjectStatusEnum("status").default("active").notNull(),
    outcome: text("outcome"),
    nextActionId: uuid("next_action_id"),
    sortOrder: integer("sort_order").default(0).notNull(),
    dueDate: date("due_date"),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("idx_gtd_projects_user_status").on(table.userId, table.status),
  ]
);

export const gtdContexts = pgTable(
  "gtd_contexts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    icon: varchar("icon", { length: 50 }),
    color: varchar("color", { length: 7 }),
    sortOrder: integer("sort_order").default(0).notNull(),
    isDefault: boolean("is_default").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("uq_gtd_contexts_user_name").on(table.userId, table.name),
  ]
);

export const gtdWeeklyReviews = pgTable(
  "gtd_weekly_reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    weekStart: date("week_start").notNull(),
    inboxCleared: boolean("inbox_cleared").default(false).notNull(),
    projectsReviewed: boolean("projects_reviewed").default(false).notNull(),
    nextActionsUpdated: boolean("next_actions_updated").default(false).notNull(),
    waitingForChecked: boolean("waiting_for_checked").default(false).notNull(),
    somedayReviewed: boolean("someday_reviewed").default(false).notNull(),
    calendarReviewed: boolean("calendar_reviewed").default(false).notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("uq_gtd_weekly_reviews").on(table.userId, table.weekStart),
  ]
);
