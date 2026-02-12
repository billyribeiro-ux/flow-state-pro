import { inngest } from "../client";
import { db } from "@/lib/db";
import { dailyAnalytics, weeklyAnalytics, users } from "@/lib/db/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";

export const weeklyReviewCompile = inngest.createFunction(
  { id: "weekly-review-compile", name: "Weekly Review Compile" },
  { cron: "0 6 * * 1" }, // Every Monday at 6 AM
  async ({ step }) => {
    const activeUsers = await step.run("fetch-active-users", async () => {
      return db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.onboardingCompleted, true));
    });

    for (const user of activeUsers) {
      await step.run(`compile-weekly-${user.id}`, async () => {
        const now = new Date();
        const lastMonday = new Date(now);
        lastMonday.setDate(now.getDate() - 7);
        const lastMondayStr = lastMonday.toISOString().split("T")[0]!;
        const lastSundayStr = new Date(
          now.getTime() - 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split("T")[0]!;

        const dailyData = await db
          .select()
          .from(dailyAnalytics)
          .where(
            and(
              eq(dailyAnalytics.userId, user.id),
              gte(dailyAnalytics.date, lastMondayStr),
              lte(dailyAnalytics.date, lastSundayStr)
            )
          );

        if (dailyData.length === 0) return;

        const totalFocus = dailyData.reduce((s, d) => s + (d.totalFocusMinutes ?? 0), 0);
        const totalSessions = dailyData.reduce((s, d) => s + (d.sessionsCompleted ?? 0), 0);
        const totalTasks = dailyData.reduce((s, d) => s + (d.tasksCompleted ?? 0), 0);

        let bestDay = dailyData[0]!;
        for (const day of dailyData) {
          if ((day.totalFocusMinutes ?? 0) > (bestDay.totalFocusMinutes ?? 0)) {
            bestDay = day;
          }
        }

        await db
          .insert(weeklyAnalytics)
          .values({
            userId: user.id,
            weekStart: lastMondayStr,
            totalFocusMinutes: totalFocus,
            totalSessions: totalSessions,
            totalTasks: totalTasks,
            avgDailyFocusMinutes: Math.round(totalFocus / 7),
            bestDay: bestDay.date,
            bestDayMinutes: bestDay.totalFocusMinutes ?? 0,
          })
          .onConflictDoUpdate({
            target: [weeklyAnalytics.userId, weeklyAnalytics.weekStart],
            set: {
              totalFocusMinutes: totalFocus,
              totalSessions: totalSessions,
              totalTasks: totalTasks,
              avgDailyFocusMinutes: Math.round(totalFocus / 7),
              bestDay: bestDay.date,
              bestDayMinutes: bestDay.totalFocusMinutes ?? 0,
              updatedAt: new Date(),
            },
          });
      });
    }

    return { processed: activeUsers.length };
  }
);
