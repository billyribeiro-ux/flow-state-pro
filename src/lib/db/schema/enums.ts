import { pgEnum } from "drizzle-orm/pg-core";

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

export const methodologyStatusEnum = pgEnum("methodology_status_enum", [
  "locked",
  "available",
  "active",
  "mastered",
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

export const paretoCategory = pgEnum("pareto_category_enum", [
  "high_impact",
  "low_impact",
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
