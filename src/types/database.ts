import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

import type { users } from "@/lib/db/schema/users";
import type { methodologyProgress } from "@/lib/db/schema/methodologies";
import type { tasks } from "@/lib/db/schema/tasks";
import type { gtdProjects } from "@/lib/db/schema/gtd";
import type { sessions, sessionTasks } from "@/lib/db/schema/sessions";
import type { timeBlocks } from "@/lib/db/schema/time-blocks";
import type { timeEntries } from "@/lib/db/schema/time-entries";
import type { coachingMessages, coachingConversations } from "@/lib/db/schema/coaching";
import type { pushSubscriptions } from "@/lib/db/schema/notifications";
import type { videoProgress } from "@/lib/db/schema/video-progress";
import type { dailyAnalytics, weeklyAnalytics } from "@/lib/db/schema/analytics";
import type { auditLog } from "@/lib/db/schema/audit-log";

// Select types (read from DB)
export type User = InferSelectModel<typeof users>;
export type MethodologyProgress = InferSelectModel<typeof methodologyProgress>;
export type Task = InferSelectModel<typeof tasks>;
export type GtdProject = InferSelectModel<typeof gtdProjects>;
export type Session = InferSelectModel<typeof sessions>;
export type SessionTask = InferSelectModel<typeof sessionTasks>;
export type TimeBlock = InferSelectModel<typeof timeBlocks>;
export type TimeEntry = InferSelectModel<typeof timeEntries>;
export type CoachingMessage = InferSelectModel<typeof coachingMessages>;
export type CoachingConversation = InferSelectModel<typeof coachingConversations>;
export type PushSubscription = InferSelectModel<typeof pushSubscriptions>;
export type VideoProgress = InferSelectModel<typeof videoProgress>;
export type DailyAnalytics = InferSelectModel<typeof dailyAnalytics>;
export type WeeklyAnalytics = InferSelectModel<typeof weeklyAnalytics>;
export type AuditLog = InferSelectModel<typeof auditLog>;

// Insert types (write to DB)
export type NewUser = InferInsertModel<typeof users>;
export type NewTask = InferInsertModel<typeof tasks>;
export type NewSession = InferInsertModel<typeof sessions>;
export type NewTimeBlock = InferInsertModel<typeof timeBlocks>;
export type NewTimeEntry = InferInsertModel<typeof timeEntries>;
export type NewCoachingMessage = InferInsertModel<typeof coachingMessages>;
export type NewGtdProject = InferInsertModel<typeof gtdProjects>;
