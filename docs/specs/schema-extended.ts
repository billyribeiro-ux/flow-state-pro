/**
 * FlowState Pro — Database Schema (Continued)
 * Coaching, Notifications, Video, Analytics, Audit tables + All Relations
 */

import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  decimal,
  index,
  inet,
  integer,
  jsonb,
  pgTable,
  smallint,
  text,
  time,
  timestamp,
  uniqueIndex,
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
  users,
  tasks,
  sessions,
  sessionTasks,
  timeBlocks,
  timeEntries,
  methodologyProgress,
  gtdProjects,
} from "./schema-core";

// ============================================================================
// COACHING SYSTEM
// ============================================================================

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

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export const pushSubscriptions = pgTable(
  "push_subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    endpoint: text("endpoint").notNull(),
    p256dh: text("p256dh").notNull(),
    auth: text("auth").notNull(),
    deviceName: varchar("device_name", { length: 255 }),
    userAgent: text("user_agent"),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_push_subscriptions_user").on(table.userId),
    index("idx_push_subscriptions_active").on(table.userId, table.isActive),
  ]
);

// ============================================================================
// VIDEO / ONBOARDING
// ============================================================================

export const videoProgress = pgTable(
  "video_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    methodology: methodologyEnum("methodology").notNull(),
    muxAssetId: varchar("mux_asset_id", { length: 255 }).notNull(),
    watchPercentage: decimal("watch_percentage", {
      precision: 5,
      scale: 2,
    }).default("0.00"),
    totalWatchTime: interval("total_watch_time").default("0"),
    completed: boolean("completed").default(false),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    lastPosition: decimal("last_position", {
      precision: 10,
      scale: 2,
    }).default("0.00"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex("uq_video_progress").on(
      table.userId,
      table.methodology,
      table.muxAssetId
    ),
    index("idx_video_progress_user").on(table.userId),
  ]
);

// ============================================================================
// ANALYTICS (Aggregated)
// ============================================================================

export const dailyAnalytics = pgTable(
  "daily_analytics",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    date: date("date").notNull(),
    totalFocusMinutes: integer("total_focus_minutes").default(0),
    totalBreakMinutes: integer("total_break_minutes").default(0),
    sessionsCompleted: integer("sessions_completed").default(0),
    sessionsAbandoned: integer("sessions_abandoned").default(0),
    tasksCompleted: integer("tasks_completed").default(0),
    tasksCreated: integer("tasks_created").default(0),
    pomodorosCompleted: integer("pomodoros_completed").default(0),
    deepWorkMinutes: integer("deep_work_minutes").default(0),
    distractionCount: integer("distraction_count").default(0),
    frogEaten: boolean("frog_eaten").default(false),
    frogEatenTime: time("frog_eaten_time"),
    twoMinuteTasksCleared: integer("two_minute_tasks_cleared").default(0),
    batchSessionsCompleted: integer("batch_sessions_completed").default(0),
    timeBlockAdherence: decimal("time_block_adherence", {
      precision: 5,
      scale: 2,
    }),
    eisenhowerQ1Time: integer("eisenhower_q1_time").default(0),
    eisenhowerQ2Time: integer("eisenhower_q2_time").default(0),
    eisenhowerQ3Time: integer("eisenhower_q3_time").default(0),
    eisenhowerQ4Time: integer("eisenhower_q4_time").default(0),
    mostProductiveHour: smallint("most_productive_hour"),
    energyAvg: decimal("energy_avg", { precision: 3, scale: 2 }),
    focusRatingAvg: decimal("focus_rating_avg", { precision: 3, scale: 2 }),
    streakDay: integer("streak_day").default(0),
    methodologiesUsed: text("methodologies_used").array().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex("uq_daily_analytics").on(table.userId, table.date),
    index("idx_daily_analytics_user_date").on(table.userId, table.date),
  ]
);

export const weeklyAnalytics = pgTable(
  "weekly_analytics",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    weekStart: date("week_start").notNull(),
    totalFocusMinutes: integer("total_focus_minutes").default(0),
    totalSessions: integer("total_sessions").default(0),
    tasksCompleted: integer("tasks_completed").default(0),
    paretoTopActivities: jsonb("pareto_top_activities").default([]),
    paretoBottomActivities: jsonb("pareto_bottom_activities").default([]),
    timeAuditPlannedVsActual: jsonb("time_audit_planned_vs_actual").default(
      {}
    ),
    methodologyBreakdown: jsonb("methodology_breakdown").default({}),
    coachingInsights: jsonb("coaching_insights").default([]),
    goalsHit: integer("goals_hit").default(0),
    goalsMissed: integer("goals_missed").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex("uq_weekly_analytics").on(table.userId, table.weekStart),
    index("idx_weekly_analytics_user").on(table.userId, table.weekStart),
  ]
);

// ============================================================================
// AUDIT LOG
// ============================================================================

export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    action: varchar("action", { length: 100 }).notNull(),
    entityType: varchar("entity_type", { length: 50 }).notNull(),
    entityId: uuid("entity_id"),
    changes: jsonb("changes"),
    ipAddress: inet("ip_address"),
    userAgent: text("user_agent"),
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_audit_user_action").on(
      table.userId,
      table.action,
      table.createdAt
    ),
    index("idx_audit_entity").on(table.entityType, table.entityId),
  ]
);

// ============================================================================
// RELATIONS
// ============================================================================

export const usersRelations = relations(users, ({ many }) => ({
  methodologyProgress: many(methodologyProgress),
  tasks: many(tasks),
  sessions: many(sessions),
  timeBlocks: many(timeBlocks),
  timeEntries: many(timeEntries),
  gtdProjects: many(gtdProjects),
  coachingMessages: many(coachingMessages),
  coachingConversations: many(coachingConversations),
  pushSubscriptions: many(pushSubscriptions),
  videoProgress: many(videoProgress),
  dailyAnalytics: many(dailyAnalytics),
  weeklyAnalytics: many(weeklyAnalytics),
  auditLog: many(auditLog),
}));

export const methodologyProgressRelations = relations(
  methodologyProgress,
  ({ one }) => ({
    user: one(users, {
      fields: [methodologyProgress.userId],
      references: [users.id],
    }),
  })
);

export const gtdProjectsRelations = relations(
  gtdProjects,
  ({ one, many }) => ({
    user: one(users, {
      fields: [gtdProjects.userId],
      references: [users.id],
    }),
    tasks: many(tasks),
  })
);

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
  gtdProject: one(gtdProjects, {
    fields: [tasks.gtdProjectId],
    references: [gtdProjects.id],
  }),
  parentTask: one(tasks, {
    fields: [tasks.parentTaskId],
    references: [tasks.id],
    relationName: "subtasks",
  }),
  subtasks: many(tasks, { relationName: "subtasks" }),
  sessionTasks: many(sessionTasks),
  timeEntries: many(timeEntries),
}));

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
  task: one(tasks, {
    fields: [sessions.taskId],
    references: [tasks.id],
  }),
  timeBlock: one(timeBlocks, {
    fields: [sessions.timeBlockId],
    references: [timeBlocks.id],
  }),
  sessionTasks: many(sessionTasks),
}));

export const sessionTasksRelations = relations(sessionTasks, ({ one }) => ({
  session: one(sessions, {
    fields: [sessionTasks.sessionId],
    references: [sessions.id],
  }),
  task: one(tasks, {
    fields: [sessionTasks.taskId],
    references: [tasks.id],
  }),
}));

export const timeBlocksRelations = relations(
  timeBlocks,
  ({ one, many }) => ({
    user: one(users, {
      fields: [timeBlocks.userId],
      references: [users.id],
    }),
    sessions: many(sessions),
  })
);

export const timeEntriesRelations = relations(timeEntries, ({ one }) => ({
  user: one(users, {
    fields: [timeEntries.userId],
    references: [users.id],
  }),
  task: one(tasks, {
    fields: [timeEntries.taskId],
    references: [tasks.id],
  }),
  session: one(sessions, {
    fields: [timeEntries.sessionId],
    references: [sessions.id],
  }),
  timeBlock: one(timeBlocks, {
    fields: [timeEntries.timeBlockId],
    references: [timeBlocks.id],
  }),
}));

export const coachingMessagesRelations = relations(
  coachingMessages,
  ({ one }) => ({
    user: one(users, {
      fields: [coachingMessages.userId],
      references: [users.id],
    }),
  })
);

export const coachingConversationsRelations = relations(
  coachingConversations,
  ({ one }) => ({
    user: one(users, {
      fields: [coachingConversations.userId],
      references: [users.id],
    }),
  })
);

export const pushSubscriptionsRelations = relations(
  pushSubscriptions,
  ({ one }) => ({
    user: one(users, {
      fields: [pushSubscriptions.userId],
      references: [users.id],
    }),
  })
);

export const videoProgressRelations = relations(videoProgress, ({ one }) => ({
  user: one(users, {
    fields: [videoProgress.userId],
    references: [users.id],
  }),
}));

export const dailyAnalyticsRelations = relations(
  dailyAnalytics,
  ({ one }) => ({
    user: one(users, {
      fields: [dailyAnalytics.userId],
      references: [users.id],
    }),
  })
);

export const weeklyAnalyticsRelations = relations(
  weeklyAnalytics,
  ({ one }) => ({
    user: one(users, {
      fields: [weeklyAnalytics.userId],
      references: [users.id],
    }),
  })
);

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  user: one(users, {
    fields: [auditLog.userId],
    references: [users.id],
  }),
}));
