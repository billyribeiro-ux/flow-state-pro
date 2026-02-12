import { relations } from "drizzle-orm";

import { users } from "./users";
import { methodologyProgress } from "./methodologies";
import { tasks } from "./tasks";
import { gtdProjects } from "./gtd";
import { sessions, sessionTasks } from "./sessions";
import { timeBlocks } from "./time-blocks";
import { timeEntries } from "./time-entries";
import { coachingMessages, coachingConversations } from "./coaching";
import { pushSubscriptions } from "./notifications";
import { videoProgress } from "./video-progress";
import { dailyAnalytics, weeklyAnalytics } from "./analytics";
import { auditLog } from "./audit-log";

// ============================================================================
// USER RELATIONS
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

// ============================================================================
// METHODOLOGY PROGRESS RELATIONS
// ============================================================================

export const methodologyProgressRelations = relations(
  methodologyProgress,
  ({ one }) => ({
    user: one(users, {
      fields: [methodologyProgress.userId],
      references: [users.id],
    }),
  })
);

// ============================================================================
// GTD PROJECT RELATIONS
// ============================================================================

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

// ============================================================================
// TASK RELATIONS
// ============================================================================

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

// ============================================================================
// SESSION RELATIONS
// ============================================================================

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

// ============================================================================
// TIME BLOCK RELATIONS
// ============================================================================

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

// ============================================================================
// TIME ENTRY RELATIONS
// ============================================================================

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

// ============================================================================
// COACHING RELATIONS
// ============================================================================

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

// ============================================================================
// NOTIFICATION RELATIONS
// ============================================================================

export const pushSubscriptionsRelations = relations(
  pushSubscriptions,
  ({ one }) => ({
    user: one(users, {
      fields: [pushSubscriptions.userId],
      references: [users.id],
    }),
  })
);

// ============================================================================
// VIDEO PROGRESS RELATIONS
// ============================================================================

export const videoProgressRelations = relations(videoProgress, ({ one }) => ({
  user: one(users, {
    fields: [videoProgress.userId],
    references: [users.id],
  }),
}));

// ============================================================================
// ANALYTICS RELATIONS
// ============================================================================

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

// ============================================================================
// AUDIT LOG RELATIONS
// ============================================================================

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  user: one(users, {
    fields: [auditLog.userId],
    references: [users.id],
  }),
}));
