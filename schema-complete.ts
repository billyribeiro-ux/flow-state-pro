/**
 * FlowState Pro — COMPLETE Database Schema
 * Drizzle ORM + PostgreSQL 16
 *
 * This is the SINGLE SOURCE OF TRUTH for the entire database.
 * Every table, index, relation, and enum in ONE file.
 *
 * Run: pnpm drizzle-kit generate
 * Run: pnpm drizzle-kit migrate
 */

import { relations, sql } from "drizzle-orm";
import {
  boolean,
  date,
  decimal,
  index,
  inet,
  integer,
  interval,
  jsonb,
  pgEnum,
  pgTable,
  smallint,
  text,
  time,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// ============================================================================
// ENUMS
// ============================================================================

export const methodologyEnum = pgEnum("methodology_enum", [
  "pomodoro",
  "gtd",
  "eisenhower",
  "time_blocking",
  "pareto",
  "deep_work",
  "eat_the_frog",
  "two_minute",
  "batch",
  "time_audit",
]);

export const userRoleEnum = pgEnum("user_role_enum", [
  "user",
  "admin",
  "super_admin",
]);

export const taskStatusEnum = pgEnum("task_status_enum", [
  "inbox",
  "active",
  "completed",
  "archived",
  "deleted",
]);

export const taskPriorityEnum = pgEnum("task_priority_enum", [
  "none",
  "low",
  "medium",
  "high",
  "urgent",
]);

export const eisenhowerQuadrantEnum = pgEnum("eisenhower_quadrant_enum", [
  "do",
  "schedule",
  "delegate",
  "eliminate",
]);

export const gtdStatusEnum = pgEnum("gtd_status_enum", [
  "inbox",
  "next_action",
  "waiting_for",
  "someday_maybe",
  "reference",
]);

export const gtdProjectStatusEnum = pgEnum("gtd_project_status_enum", [
  "active",
  "completed",
  "someday_maybe",
  "archived",
]);

export const methodologyProgressStatusEnum = pgEnum(
  "methodology_progress_status_enum",
  ["locked", "available", "active", "mastered"]
);

export const sessionTypeEnum = pgEnum("session_type_enum", [
  "focus",
  "break",
  "short_break",
  "long_break",
  "review",
  "batch",
  "deep_work",
  "frog",
]);

export const sessionStatusEnum = pgEnum("session_status_enum", [
  "planned",
  "active",
  "paused",
  "completed",
  "cancelled",
  "abandoned",
]);

export const timeBlockTypeEnum = pgEnum("time_block_type_enum", [
  "focus",
  "meeting",
  "break",
  "admin",
  "deep_work",
  "batch",
  "buffer",
]);

export const timeEntrySourceEnum = pgEnum("time_entry_source_enum", [
  "manual",
  "automatic",
  "session",
  "time_block",
]);

export const coachingMessageTypeEnum = pgEnum("coaching_message_type_enum", [
  "nudge",
  "insight",
  "reminder",
  "celebration",
  "warning",
  "daily_brief",
  "weekly_review",
  "suggestion",
  "unlock",
]);

export const coachingTriggerEnum = pgEnum("coaching_trigger_enum", [
  "scheduled",
  "event",
  "pattern",
  "ai_generated",
  "system",
]);

export const coachingPriorityEnum = pgEnum("coaching_priority_enum", [
  "low",
  "medium",
  "high",
  "critical",
]);

export const coachingChannelEnum = pgEnum("coaching_channel_enum", [
  "in_app",
  "push",
  "email",
  "sms",
]);

export const coachingStatusEnum = pgEnum("coaching_status_enum", [
  "pending",
  "sent",
  "delivered",
  "read",
  "dismissed",
  "acted_on",
]);

export const paretoImpactEnum = pgEnum("pareto_impact_enum", [
  "high_impact",
  "low_impact",
]);

// ============================================================================
// TABLES
// ============================================================================

// --- Users -------------------------------------------------------------------

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: varchar("clerk_id", { length: 255 }).unique().notNull(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    firstName: varchar("first_name", { length: 100 }),
    lastName: varchar("last_name", { length: 100 }),
    avatarUrl: text("avatar_url"),
    timezone: varchar("timezone", { length: 50 }).default("UTC").notNull(),
    role: userRoleEnum("role").default("user").notNull(),
    onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
    activeMethodology: methodologyEnum("active_methodology"),
    coachingPreferences: jsonb("coaching_preferences")
      .default({
        tone: "encouraging",
        nudge_frequency: "moderate",
        quiet_hours_start: "22:00",
        quiet_hours_end: "07:00",
        morning_brief_time: "07:00",
        weekly_review_day: 0,
      })
      .$type<{
        tone: "encouraging" | "direct" | "analytical" | "motivational";
        nudge_frequency: "aggressive" | "moderate" | "minimal";
        quiet_hours_start: string | null;
        quiet_hours_end: string | null;
        morning_brief_time: string;
        weekly_review_day: number;
      }>()
      .notNull(),
    notificationSettings: jsonb("notification_settings")
      .default({
        push_enabled: true,
        email_digest: true,
        email_frequency: "daily",
        sound_enabled: true,
      })
      .$type<{
        push_enabled: boolean;
        email_digest: boolean;
        email_frequency: "daily" | "weekly" | "none";
        sound_enabled: boolean;
      }>()
      .notNull(),
    streakCurrent: integer("streak_current").default(0).notNull(),
    streakLongest: integer("streak_longest").default(0).notNull(),
    streakLastActive: date("streak_last_active"),
    totalFocusMinutes: integer("total_focus_minutes").default(0).notNull(),
    totalTasksCompleted: integer("total_tasks_completed").default(0).notNull(),
    totalFrogsEaten: integer("total_frogs_eaten").default(0).notNull(),
    totalPomodorosCompleted: integer("total_pomodoros_completed").default(0).notNull(),
    totalDeepWorkMinutes: integer("total_deep_work_minutes").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("idx_users_clerk_id").on(table.clerkId),
    index("idx_users_email").on(table.email),
    index("idx_users_active_methodology").on(table.activeMethodology),
  ]
);

// --- Methodology Progress ----------------------------------------------------

export const methodologyProgress = pgTable(
  "methodology_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    methodology: methodologyEnum("methodology").notNull(),
    status: methodologyProgressStatusEnum("status").default("locked").notNull(),
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

// --- GTD Projects ------------------------------------------------------------

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

// --- GTD Contexts ------------------------------------------------------------

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

// --- GTD Weekly Reviews ------------------------------------------------------

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

// --- Tasks -------------------------------------------------------------------

export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    title: varchar("title", { length: 500 }).notNull(),
    description: text("description"),
    status: taskStatusEnum("status").default("inbox").notNull(),
    priority: taskPriorityEnum("priority").default("none").notNull(),

    // Eisenhower Matrix
    eisenhowerQuadrant: eisenhowerQuadrantEnum("eisenhower_quadrant"),
    urgencyScore: smallint("urgency_score"),
    importanceScore: smallint("importance_score"),

    // GTD
    gtdStatus: gtdStatusEnum("gtd_status"),
    gtdContext: varchar("gtd_context", { length: 100 }),
    gtdProjectId: uuid("gtd_project_id").references(() => gtdProjects.id, {
      onDelete: "set null",
    }),
    gtdWaitingFor: varchar("gtd_waiting_for", { length: 255 }),
    gtdDelegatedTo: varchar("gtd_delegated_to", { length: 255 }),
    gtdWaitingSince: date("gtd_waiting_since"),

    // Eat The Frog
    isFrog: boolean("is_frog").default(false).notNull(),
    frogDate: date("frog_date"),
    frogCompletedAt: timestamp("frog_completed_at", { withTimezone: true }),

    // Two-Minute Rule
    estimatedMinutes: smallint("estimated_minutes"),
    isTwoMinute: boolean("is_two_minute").default(false).notNull(),
    deferCount: integer("defer_count").default(0).notNull(),

    // Batch Processing
    batchCategory: varchar("batch_category", { length: 100 }),
    batchSessionId: uuid("batch_session_id"),

    // Time Tracking
    estimatedDuration: interval("estimated_duration"),
    actualDuration: interval("actual_duration"),
    timeBlockId: uuid("time_block_id"),

    // Pareto / Impact
    impactScore: smallint("impact_score"),
    effortScore: smallint("effort_score"),
    paretoCategory: paretoImpactEnum("pareto_category"),
    impactNotes: text("impact_notes"),

    // Metadata
    tags: text("tags").array().default([]),
    dueDate: date("due_date"),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    sortOrder: integer("sort_order").default(0).notNull(),
    recurrenceRule: varchar("recurrence_rule", { length: 255 }),
    parentTaskId: uuid("parent_task_id"),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("idx_tasks_user_status").on(table.userId, table.status),
    index("idx_tasks_user_eisenhower").on(table.userId, table.eisenhowerQuadrant),
    index("idx_tasks_user_gtd").on(table.userId, table.gtdStatus),
    index("idx_tasks_user_frog").on(table.userId, table.frogDate),
    index("idx_tasks_user_batch").on(table.userId, table.batchCategory),
    index("idx_tasks_user_due").on(table.userId, table.dueDate),
    index("idx_tasks_parent").on(table.parentTaskId),
    index("idx_tasks_two_minute").on(table.userId, table.isTwoMinute),
    index("idx_tasks_pareto").on(table.userId, table.paretoCategory),
    index("idx_tasks_user_priority").on(table.userId, table.priority),
  ]
);

// --- Sessions ----------------------------------------------------------------

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    methodology: methodologyEnum("methodology").notNull(),
    sessionType: sessionTypeEnum("session_type").notNull(),
    status: sessionStatusEnum("status").default("planned").notNull(),

    // Timing
    plannedDurationSeconds: integer("planned_duration_seconds").notNull(),
    actualDurationSeconds: integer("actual_duration_seconds"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    pausedAt: timestamp("paused_at", { withTimezone: true }),
    totalPauseSeconds: integer("total_pause_seconds").default(0).notNull(),

    // Pomodoro-specific
    pomodoroCycle: smallint("pomodoro_cycle"),
    pomodoroSet: smallint("pomodoro_set"),

    // Deep Work-specific
    distractionCount: integer("distraction_count").default(0).notNull(),
    distractionLog: jsonb("distraction_log")
      .default([])
      .$type<
        Array<{
          timestamp: string;
          description: string;
          duration_seconds: number;
          category: string;
        }>
      >()
      .notNull(),

    // Batch-specific
    batchCategory: varchar("batch_category", { length: 100 }),
    tasksCompletedCount: integer("tasks_completed_count").default(0).notNull(),

    // Quality metrics
    focusRating: smallint("focus_rating"),
    energyLevelBefore: smallint("energy_level_before"),
    energyLevelAfter: smallint("energy_level_after"),
    notes: text("notes"),
    abandonReason: text("abandon_reason"),

    // Linked entities
    taskId: uuid("task_id").references(() => tasks.id, { onDelete: "set null" }),
    timeBlockId: uuid("time_block_id"),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_sessions_user_methodology").on(table.userId, table.methodology),
    index("idx_sessions_user_date").on(table.userId, table.startedAt),
    index("idx_sessions_active").on(table.userId, table.status),
    index("idx_sessions_completed").on(table.userId, table.methodology, table.endedAt),
    index("idx_sessions_type").on(table.userId, table.sessionType),
  ]
);

// --- Session Tasks (many-to-many) -------------------------------------------

export const sessionTasks = pgTable(
  "session_tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id")
      .references(() => sessions.id, { onDelete: "cascade" })
      .notNull(),
    taskId: uuid("task_id")
      .references(() => tasks.id, { onDelete: "cascade" })
      .notNull(),
    completedInSession: boolean("completed_in_session").default(false).notNull(),
    timeSpentSeconds: integer("time_spent_seconds"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("uq_session_tasks").on(table.sessionId, table.taskId),
  ]
);

// --- Time Blocks -------------------------------------------------------------

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

// --- Time Entries (Time Audit) -----------------------------------------------

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
    source: timeEntrySourceEnum("source").default("manual").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    durationSeconds: integer("duration_seconds"),
    isProductive: boolean("is_productive"),
    productivityScore: smallint("productivity_score"),
    taskId: uuid("task_id").references(() => tasks.id, { onDelete: "set null" }),
    sessionId: uuid("session_id").references(() => sessions.id, { onDelete: "set null" }),
    timeBlockId: uuid("time_block_id").references(() => timeBlocks.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_time_entries_user_date").on(table.userId, table.startedAt),
    index("idx_time_entries_user_category").on(table.userId, table.category),
    index("idx_time_entries_user_productive").on(table.userId, table.isProductive),
    index("idx_time_entries_session").on(table.sessionId),
  ]
);

// --- Batch Categories --------------------------------------------------------

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

// --- Coaching Messages -------------------------------------------------------

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
    triggerId: varchar("trigger_id", { length: 100 }),
    title: varchar("title", { length: 255 }).notNull(),
    body: text("body").notNull(),
    actionUrl: varchar("action_url", { length: 500 }),
    actionLabel: varchar("action_label", { length: 100 }),
    priority: coachingPriorityEnum("priority").default("medium").notNull(),
    channel: coachingChannelEnum("channel").notNull(),
    status: coachingStatusEnum("status").default("pending").notNull(),
    scheduledFor: timestamp("scheduled_for", { withTimezone: true }),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    readAt: timestamp("read_at", { withTimezone: true }),
    dismissedAt: timestamp("dismissed_at", { withTimezone: true }),
    actedOnAt: timestamp("acted_on_at", { withTimezone: true }),
    metadata: jsonb("metadata").default({}).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_coaching_user_status").on(table.userId, table.status),
    index("idx_coaching_user_type").on(table.userId, table.messageType),
    index("idx_coaching_scheduled").on(table.scheduledFor),
    index("idx_coaching_trigger_id").on(table.userId, table.triggerId),
  ]
);

// --- Coaching Conversations --------------------------------------------------

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
      >()
      .notNull(),
    tokenCount: integer("token_count").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("idx_coaching_conversations_user").on(table.userId)]
);

// --- Push Subscriptions ------------------------------------------------------

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
    isActive: boolean("is_active").default(true).notNull(),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_push_subscriptions_user").on(table.userId),
    index("idx_push_subscriptions_active").on(table.userId, table.isActive),
  ]
);

// --- Video Progress ----------------------------------------------------------

export const videoProgress = pgTable(
  "video_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    methodology: methodologyEnum("methodology").notNull(),
    muxAssetId: varchar("mux_asset_id", { length: 255 }).notNull(),
    muxPlaybackId: varchar("mux_playback_id", { length: 255 }),
    videoDurationSeconds: integer("video_duration_seconds"),
    watchPercentage: decimal("watch_percentage", { precision: 5, scale: 2 })
      .default("0.00")
      .notNull(),
    totalWatchTimeSeconds: integer("total_watch_time_seconds").default(0).notNull(),
    completed: boolean("completed").default(false).notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    lastPosition: decimal("last_position", { precision: 10, scale: 2 })
      .default("0.00")
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
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

// --- Daily Analytics ---------------------------------------------------------

export const dailyAnalytics = pgTable(
  "daily_analytics",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    date: date("date").notNull(),

    // Session metrics
    totalFocusMinutes: integer("total_focus_minutes").default(0).notNull(),
    totalBreakMinutes: integer("total_break_minutes").default(0).notNull(),
    sessionsCompleted: integer("sessions_completed").default(0).notNull(),
    sessionsAbandoned: integer("sessions_abandoned").default(0).notNull(),

    // Task metrics
    tasksCompleted: integer("tasks_completed").default(0).notNull(),
    tasksCreated: integer("tasks_created").default(0).notNull(),

    // Pomodoro
    pomodorosCompleted: integer("pomodoros_completed").default(0).notNull(),
    pomodoroSetsCompleted: integer("pomodoro_sets_completed").default(0).notNull(),
    avgPomodoroFocusRating: decimal("avg_pomodoro_focus_rating", { precision: 3, scale: 2 }),

    // Deep Work
    deepWorkMinutes: integer("deep_work_minutes").default(0).notNull(),
    deepWorkSessions: integer("deep_work_sessions").default(0).notNull(),
    distractionCount: integer("distraction_count").default(0).notNull(),

    // Eat The Frog
    frogEaten: boolean("frog_eaten").default(false).notNull(),
    frogEatenTime: time("frog_eaten_time"),
    frogEatenBeforeNoon: boolean("frog_eaten_before_noon").default(false).notNull(),

    // Two-Minute Rule
    twoMinuteTasksCleared: integer("two_minute_tasks_cleared").default(0).notNull(),
    twoMinuteTasksDeferred: integer("two_minute_tasks_deferred").default(0).notNull(),

    // Batch Processing
    batchSessionsCompleted: integer("batch_sessions_completed").default(0).notNull(),
    batchTasksCompleted: integer("batch_tasks_completed").default(0).notNull(),

    // Time Blocking
    timeBlockAdherence: decimal("time_block_adherence", { precision: 5, scale: 2 }),
    timeBlocksPlanned: integer("time_blocks_planned").default(0).notNull(),
    timeBlocksCompleted: integer("time_blocks_completed").default(0).notNull(),
    timeBlockOverrunMinutes: integer("time_block_overrun_minutes").default(0).notNull(),

    // Eisenhower
    eisenhowerQ1Time: integer("eisenhower_q1_time").default(0).notNull(),
    eisenhowerQ2Time: integer("eisenhower_q2_time").default(0).notNull(),
    eisenhowerQ3Time: integer("eisenhower_q3_time").default(0).notNull(),
    eisenhowerQ4Time: integer("eisenhower_q4_time").default(0).notNull(),
    eisenhowerTasksSorted: integer("eisenhower_tasks_sorted").default(0).notNull(),

    // GTD
    gtdInboxItemsProcessed: integer("gtd_inbox_items_processed").default(0).notNull(),
    gtdInboxEndOfDay: integer("gtd_inbox_end_of_day").default(0).notNull(),
    gtdNextActionsCompleted: integer("gtd_next_actions_completed").default(0).notNull(),
    gtdWeeklyReviewCompleted: boolean("gtd_weekly_review_completed").default(false).notNull(),

    // Pareto
    paretoHighImpactMinutes: integer("pareto_high_impact_minutes").default(0).notNull(),
    paretoLowImpactMinutes: integer("pareto_low_impact_minutes").default(0).notNull(),

    // Time Audit
    timeAuditTrackedMinutes: integer("time_audit_tracked_minutes").default(0).notNull(),
    timeAuditProductiveMinutes: integer("time_audit_productive_minutes").default(0).notNull(),
    timeAuditUnproductiveMinutes: integer("time_audit_unproductive_minutes").default(0).notNull(),

    // General metrics
    mostProductiveHour: smallint("most_productive_hour"),
    energyAvg: decimal("energy_avg", { precision: 3, scale: 2 }),
    focusRatingAvg: decimal("focus_rating_avg", { precision: 3, scale: 2 }),
    streakDay: integer("streak_day").default(0).notNull(),
    methodologiesUsed: text("methodologies_used").array().default([]).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("uq_daily_analytics").on(table.userId, table.date),
    index("idx_daily_analytics_user_date").on(table.userId, table.date),
  ]
);

// --- Weekly Analytics --------------------------------------------------------

export const weeklyAnalytics = pgTable(
  "weekly_analytics",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    weekStart: date("week_start").notNull(),
    totalFocusMinutes: integer("total_focus_minutes").default(0).notNull(),
    totalSessions: integer("total_sessions").default(0).notNull(),
    tasksCompleted: integer("tasks_completed").default(0).notNull(),

    // Pareto
    paretoTopActivities: jsonb("pareto_top_activities").default([]).notNull()
      .$type<Array<{ category: string; minutes: number; tasks: number; impactScore: number }>>(),
    paretoBottomActivities: jsonb("pareto_bottom_activities").default([]).notNull()
      .$type<Array<{ category: string; minutes: number; tasks: number; impactScore: number }>>(),
    paretoRatio: decimal("pareto_ratio", { precision: 5, scale: 2 }),

    // Time Audit
    timeAuditPlannedVsActual: jsonb("time_audit_planned_vs_actual").default({}).notNull()
      .$type<Record<string, { planned: number; actual: number }>>(),
    timeAuditCategoryBreakdown: jsonb("time_audit_category_breakdown").default({}).notNull()
      .$type<Record<string, number>>(),

    // Methodology breakdown
    methodologyBreakdown: jsonb("methodology_breakdown").default({}).notNull()
      .$type<Record<string, { sessions: number; minutes: number; tasksCompleted: number }>>(),

    // AI insights
    coachingInsights: jsonb("coaching_insights").default([]).notNull()
      .$type<Array<{ type: string; insight: string; methodology?: string; actionable: string }>>(),

    // Scores
    overallProductivityScore: decimal("overall_productivity_score", { precision: 5, scale: 2 }),
    goalsHit: integer("goals_hit").default(0).notNull(),
    goalsMissed: integer("goals_missed").default(0).notNull(),

    // Eisenhower weekly
    eisenhowerDistribution: jsonb("eisenhower_distribution").default({}).notNull()
      .$type<{ q1: number; q2: number; q3: number; q4: number }>(),

    // Streaks
    streakMaintained: boolean("streak_maintained").default(true).notNull(),
    daysActive: integer("days_active").default(0).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("uq_weekly_analytics").on(table.userId, table.weekStart),
    index("idx_weekly_analytics_user").on(table.userId, table.weekStart),
  ]
);

// --- Milestones Achieved -----------------------------------------------------

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

// --- User Goals --------------------------------------------------------------

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

// --- Audit Log ---------------------------------------------------------------

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
    metadata: jsonb("metadata").default({}).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_audit_user_action").on(table.userId, table.action, table.createdAt),
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
  gtdContexts: many(gtdContexts),
  gtdWeeklyReviews: many(gtdWeeklyReviews),
  batchCategories: many(batchCategories),
  coachingMessages: many(coachingMessages),
  coachingConversations: many(coachingConversations),
  pushSubscriptions: many(pushSubscriptions),
  videoProgress: many(videoProgress),
  dailyAnalytics: many(dailyAnalytics),
  weeklyAnalytics: many(weeklyAnalytics),
  milestonesAchieved: many(milestonesAchieved),
  userGoals: many(userGoals),
  auditLog: many(auditLog),
}));

export const methodologyProgressRelations = relations(methodologyProgress, ({ one }) => ({
  user: one(users, { fields: [methodologyProgress.userId], references: [users.id] }),
}));

export const gtdProjectsRelations = relations(gtdProjects, ({ one, many }) => ({
  user: one(users, { fields: [gtdProjects.userId], references: [users.id] }),
  tasks: many(tasks),
}));

export const gtdContextsRelations = relations(gtdContexts, ({ one }) => ({
  user: one(users, { fields: [gtdContexts.userId], references: [users.id] }),
}));

export const gtdWeeklyReviewsRelations = relations(gtdWeeklyReviews, ({ one }) => ({
  user: one(users, { fields: [gtdWeeklyReviews.userId], references: [users.id] }),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  user: one(users, { fields: [tasks.userId], references: [users.id] }),
  gtdProject: one(gtdProjects, { fields: [tasks.gtdProjectId], references: [gtdProjects.id] }),
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
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
  task: one(tasks, { fields: [sessions.taskId], references: [tasks.id] }),
  timeBlock: one(timeBlocks, { fields: [sessions.timeBlockId], references: [timeBlocks.id] }),
  sessionTasks: many(sessionTasks),
  timeEntries: many(timeEntries),
}));

export const sessionTasksRelations = relations(sessionTasks, ({ one }) => ({
  session: one(sessions, { fields: [sessionTasks.sessionId], references: [sessions.id] }),
  task: one(tasks, { fields: [sessionTasks.taskId], references: [tasks.id] }),
}));

export const timeBlocksRelations = relations(timeBlocks, ({ one, many }) => ({
  user: one(users, { fields: [timeBlocks.userId], references: [users.id] }),
  sessions: many(sessions),
}));

export const timeEntriesRelations = relations(timeEntries, ({ one }) => ({
  user: one(users, { fields: [timeEntries.userId], references: [users.id] }),
  task: one(tasks, { fields: [timeEntries.taskId], references: [tasks.id] }),
  session: one(sessions, { fields: [timeEntries.sessionId], references: [sessions.id] }),
  timeBlock: one(timeBlocks, { fields: [timeEntries.timeBlockId], references: [timeBlocks.id] }),
}));

export const batchCategoriesRelations = relations(batchCategories, ({ one }) => ({
  user: one(users, { fields: [batchCategories.userId], references: [users.id] }),
}));

export const coachingMessagesRelations = relations(coachingMessages, ({ one }) => ({
  user: one(users, { fields: [coachingMessages.userId], references: [users.id] }),
}));

export const coachingConversationsRelations = relations(coachingConversations, ({ one }) => ({
  user: one(users, { fields: [coachingConversations.userId], references: [users.id] }),
}));

export const pushSubscriptionsRelations = relations(pushSubscriptions, ({ one }) => ({
  user: one(users, { fields: [pushSubscriptions.userId], references: [users.id] }),
}));

export const videoProgressRelations = relations(videoProgress, ({ one }) => ({
  user: one(users, { fields: [videoProgress.userId], references: [users.id] }),
}));

export const dailyAnalyticsRelations = relations(dailyAnalytics, ({ one }) => ({
  user: one(users, { fields: [dailyAnalytics.userId], references: [users.id] }),
}));

export const weeklyAnalyticsRelations = relations(weeklyAnalytics, ({ one }) => ({
  user: one(users, { fields: [weeklyAnalytics.userId], references: [users.id] }),
}));

export const milestonesAchievedRelations = relations(milestonesAchieved, ({ one }) => ({
  user: one(users, { fields: [milestonesAchieved.userId], references: [users.id] }),
}));

export const userGoalsRelations = relations(userGoals, ({ one }) => ({
  user: one(users, { fields: [userGoals.userId], references: [users.id] }),
}));

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  user: one(users, { fields: [auditLog.userId], references: [users.id] }),
}));
