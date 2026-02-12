import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import {
  coachingChannelEnum,
  coachingMessageTypeEnum,
  coachingPriorityEnum,
  coachingStatusEnum,
  coachingTriggerEnum,
  methodologyEnum,
} from "./enums";
import { users } from "./users";

export const coachingMessages = pgTable(
  "coaching_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    methodology: methodologyEnum("methodology"),
    messageType: coachingMessageTypeEnum("message_type").notNull(),
    trigger: coachingTriggerEnum("trigger").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    body: text("body").notNull(),
    actionUrl: varchar("action_url", { length: 500 }),
    actionLabel: varchar("action_label", { length: 100 }),
    priority: coachingPriorityEnum("priority").default("medium"),
    channel: coachingChannelEnum("channel").notNull(),
    status: coachingStatusEnum("status").default("pending"),
    scheduledFor: timestamp("scheduled_for", { withTimezone: true }),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    readAt: timestamp("read_at", { withTimezone: true }),
    dismissedAt: timestamp("dismissed_at", { withTimezone: true }),
    actedOnAt: timestamp("acted_on_at", { withTimezone: true }),
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_coaching_user_status").on(table.userId, table.status),
    index("idx_coaching_user_type").on(table.userId, table.messageType),
    index("idx_coaching_scheduled").on(table.scheduledFor),
  ]
);

export const coachingConversations = pgTable(
  "coaching_conversations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    title: varchar("title", { length: 255 }),
    methodologyContext: methodologyEnum("methodology_context"),
    messages: jsonb("messages")
      .default([])
      .$type<
        Array<{
          role: "user" | "assistant";
          content: string;
          timestamp: string;
        }>
      >(),
    tokenCount: integer("token_count").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_coaching_conversations_user").on(table.userId),
  ]
);
