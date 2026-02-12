import { inngest } from "../client";
import { db } from "@/lib/db";
import { dailyAnalytics, weeklyAnalytics, users } from "@/lib/db/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";

export const weeklyAnalyticsAggregate = inngest.createFunction(
  { id: "analytics-aggregate-weekly", name: "Weekly Analytics Aggregation" },
  { cron: "10 0 * * 1" }, // Monday 00:10 UTC
  async ({ step }) => {
    const activeUsers = await step.run("find-users-with-weekly-data", async () => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekAgoStr = weekAgo.toISOString().split("T")[0]!;

      const result = await db
        .selectDistinct({ userId: dailyAnalytics.userId })
        .from(dailyAnalytics)
        .where(gte(dailyAnalytics.date, weekAgoStr));

      return result.map((r) => r.userId);
    });

    let processed = 0;

    for (const userId of activeUsers) {
      await step.run(`aggregate-weekly-${userId}`, async () => {
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - 7);
        const weekStartStr = weekStart.toISOString().split("T")[0]!;
        const weekEndStr = new Date(now.getTime() - 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0]!;

        const dailyData = await db
          .select()
          .from(dailyAnalytics)
          .where(
            and(
              eq(dailyAnalytics.userId, userId),
              gte(dailyAnalytics.date, weekStartStr),
              lte(dailyAnalytics.date, weekEndStr)
            )
          );

        if (dailyData.length === 0) return;

        const totalFocus = dailyData.reduce((s, d) => s + (d.totalFocusMinutes ?? 0), 0);
        const totalBreak = dailyData.reduce((s, d) => s + (d.totalBreakMinutes ?? 0), 0);
        const totalSessions = dailyData.reduce((s, d) => s + (d.sessionsCompleted ?? 0), 0);
        const totalTasks = dailyData.reduce((s, d) => s + (d.tasksCompleted ?? 0), 0);
        const totalPomodoros = dailyData.reduce((s, d) => s + (d.pomodorosCompleted ?? 0), 0);
        const totalDistractions = dailyData.reduce((s, d) => s + (d.distractionCount ?? 0), 0);
        const daysActive = dailyData.filter((d) => (d.sessionsCompleted ?? 0) > 0).length;

        // Find best day
        let bestDay = dailyData[0]!;
        for (const day of dailyData) {
          if ((day.totalFocusMinutes ?? 0) > (bestDay.totalFocusMinutes ?? 0)) {
            bestDay = day;
          }
        }

        // Check if streak was maintained all week
        const streakMaintained = daysActive >= 5;

        // Get user for methodology info
        const [user] = await db
          .select({ streakCurrent: users.streakCurrent })
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);

        await db
          .insert(weeklyAnalytics)
          .values({
            userId,
            weekStart: weekStartStr,
            totalFocusMinutes: totalFocus,
            totalBreakMinutes: totalBreak,
            totalSessions,
            totalTasks,
            pomodorosCompleted: totalPomodoros,
            distractionCount: totalDistractions,
            avgDailyFocusMinutes: Math.round(totalFocus / 7),
            bestDay: bestDay.date,
            bestDayMinutes: bestDay.totalFocusMinutes ?? 0,
            daysActive,
            streakMaintained,
          })
          .onConflictDoUpdate({
            target: [weeklyAnalytics.userId, weeklyAnalytics.weekStart],
            set: {
              totalFocusMinutes: totalFocus,
              totalBreakMinutes: totalBreak,
              totalSessions,
              totalTasks,
              pomodorosCompleted: totalPomodoros,
              distractionCount: totalDistractions,
              avgDailyFocusMinutes: Math.round(totalFocus / 7),
              bestDay: bestDay.date,
              bestDayMinutes: bestDay.totalFocusMinutes ?? 0,
              daysActive,
              streakMaintained,
              updatedAt: new Date(),
            },
          });

        processed++;
      });
    }

    return { weeklyUsersProcessed: processed };
  }
);
