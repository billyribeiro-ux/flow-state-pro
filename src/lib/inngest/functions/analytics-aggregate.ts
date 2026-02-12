import { inngest } from "../client";
import { db } from "@/lib/db";
import { dailyAnalytics, sessions, tasks, users } from "@/lib/db/schema";
import { eq, and, sql, gte } from "drizzle-orm";

export const analyticsAggregate = inngest.createFunction(
  { id: "analytics-aggregate", name: "Daily Analytics Aggregation" },
  { cron: "*/30 * * * *" }, // Every 30 minutes
  async ({ step }) => {
    const today = new Date().toISOString().split("T")[0]!;

    const activeUsers = await step.run("fetch-active-users", async () => {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const result = await db
        .selectDistinct({ userId: sessions.userId })
        .from(sessions)
        .where(gte(sessions.startedAt, todayStart));

      return result.map((r) => r.userId);
    });

    let aggregated = 0;

    for (const userId of activeUsers) {
      await step.run(`aggregate-${userId}`, async () => {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const [sessionStats] = await db
          .select({
            focusMinutes: sql<number>`COALESCE(SUM(
              CASE WHEN ${sessions.sessionType} IN ('focus', 'deep_work', 'frog', 'batch')
              THEN ${sessions.actualDurationSeconds} / 60.0 ELSE 0 END
            ), 0)`,
            breakMinutes: sql<number>`COALESCE(SUM(
              CASE WHEN ${sessions.sessionType} = 'break'
              THEN ${sessions.actualDurationSeconds} / 60.0 ELSE 0 END
            ), 0)`,
            sessionsCompleted: sql<number>`COUNT(CASE WHEN ${sessions.status} = 'completed' THEN 1 END)`,
            pomodorosCompleted: sql<number>`COALESCE(SUM(${sessions.pomodoroSet}), 0)`,
            distractionCount: sql<number>`COALESCE(SUM(${sessions.distractionCount}), 0)`,
          })
          .from(sessions)
          .where(
            and(eq(sessions.userId, userId), gte(sessions.startedAt, todayStart))
          );

        const [taskStats] = await db
          .select({
            tasksCompleted: sql<number>`COUNT(*)`,
          })
          .from(tasks)
          .where(
            and(
              eq(tasks.userId, userId),
              eq(tasks.status, "completed"),
              gte(tasks.completedAt, todayStart)
            )
          );

        await db
          .insert(dailyAnalytics)
          .values({
            userId,
            date: today,
            totalFocusMinutes: Math.round(sessionStats?.focusMinutes ?? 0),
            totalBreakMinutes: Math.round(sessionStats?.breakMinutes ?? 0),
            sessionsCompleted: sessionStats?.sessionsCompleted ?? 0,
            tasksCompleted: taskStats?.tasksCompleted ?? 0,
            pomodorosCompleted: sessionStats?.pomodorosCompleted ?? 0,
            distractionCount: sessionStats?.distractionCount ?? 0,
          })
          .onConflictDoUpdate({
            target: [dailyAnalytics.userId, dailyAnalytics.date],
            set: {
              totalFocusMinutes: Math.round(sessionStats?.focusMinutes ?? 0),
              totalBreakMinutes: Math.round(sessionStats?.breakMinutes ?? 0),
              sessionsCompleted: sessionStats?.sessionsCompleted ?? 0,
              tasksCompleted: taskStats?.tasksCompleted ?? 0,
              pomodorosCompleted: sessionStats?.pomodorosCompleted ?? 0,
              distractionCount: sessionStats?.distractionCount ?? 0,
              updatedAt: new Date(),
            },
          });

        aggregated++;
      });
    }

    return { date: today, usersProcessed: aggregated };
  }
);
