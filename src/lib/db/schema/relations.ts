import { relations } from "drizzle-orm";

import { users } from "./users";
import { methodologyProgress } from "./methodologies";
import { tasks } from "./tasks";
import { gtdProjects, gtdContexts, gtdWeeklyReviews } from "./gtd";
import { sessions, sessionTasks } from "./sessions";
import { timeBlocks } from "./time-blocks";
import { timeEntries } from "./time-entries";
import { batchCategories } from "./batch-categories";
import { coachingMessages, coachingConversations } from "./coaching";
import { pushSubscriptions } from "./notifications";
import { videoProgress } from "./video-progress";
import { dailyAnalytics, weeklyAnalytics } from "./analytics";
import { milestonesAchieved } from "./milestones";
import { userGoals } from "./user-goals";
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
// GTD RELATIONS
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

export const gtdContextsRelations = relations(gtdContexts, ({ one }) => ({
  user: one(users, {
    fields: [gtdContexts.userId],
    references: [users.id],
  }),
}));

export const gtdWeeklyReviewsRelations = relations(
  gtdWeeklyReviews,
  ({ one }) => ({
    user: one(users, {
      fields: [gtdWeeklyReviews.userId],
      references: [users.id],
    }),
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
  timeEntries: many(timeEntries),
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
// BATCH CATEGORIES RELATIONS
// ============================================================================

export const batchCategoriesRelations = relations(
  batchCategories,
  ({ one }) => ({
    user: one(users, {
      fields: [batchCategories.userId],
      references: [users.id],
    }),
  })
);

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
// MILESTONES RELATIONS
// ============================================================================

export const milestonesAchievedRelations = relations(
  milestonesAchieved,
  ({ one }) => ({
    user: one(users, {
      fields: [milestonesAchieved.userId],
      references: [users.id],
    }),
  })
);

// ============================================================================
// USER GOALS RELATIONS
// ============================================================================

export const userGoalsRelations = relations(userGoals, ({ one }) => ({
  user: one(users, {
    fields: [userGoals.userId],
    references: [users.id],
  }),
}));

// ============================================================================
// AUDIT LOG RELATIONS
// ============================================================================

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  user: one(users, {
    fields: [auditLog.userId],
    references: [users.id],
  }),
}));
