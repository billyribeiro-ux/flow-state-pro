import { inngest } from "../client";
import { db } from "@/lib/db";
import { dailyAnalytics, users } from "@/lib/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";

export const streakCalculator = inngest.createFunction(
  { id: "streak-calculator", name: "Streak Calculator" },
  { cron: "0 0 * * *" }, // Midnight daily
  async ({ step }) => {
    const allUsers = await step.run("fetch-users", async () => {
      return db
        .select({ id: users.id, streakCurrent: users.streakCurrent, streakLongest: users.streakLongest })
        .from(users)
        .where(eq(users.onboardingCompleted, true));
    });

    let updated = 0;

    for (const user of allUsers) {
      await step.run(`calc-streak-${user.id}`, async () => {
        const recentDays = await db
          .select({ date: dailyAnalytics.date, sessions: dailyAnalytics.sessionsCompleted })
          .from(dailyAnalytics)
          .where(eq(dailyAnalytics.userId, user.id))
          .orderBy(desc(dailyAnalytics.date))
          .limit(365);

        let streak = 0;
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Check from yesterday backwards
        const dayMap = new Map(recentDays.map((d) => [d.date, d.sessions ?? 0]));
        const checkDate = new Date(yesterday);

        while (true) {
          const dateStr = checkDate.toISOString().split("T")[0]!;
          const sessions = dayMap.get(dateStr) ?? 0;
          if (sessions > 0) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }

        const newLongest = Math.max(streak, user.streakLongest ?? 0);

        await db
          .update(users)
          .set({
            streakCurrent: streak,
            streakLongest: newLongest,
            updatedAt: new Date(),
          })
          .where(eq(users.id, user.id));

        // Also update in daily analytics for today
        const todayStr = today.toISOString().split("T")[0]!;
        await db
          .update(dailyAnalytics)
          .set({ streakDay: streak })
          .where(
            and(
              eq(dailyAnalytics.userId, user.id),
              eq(dailyAnalytics.date, todayStr)
            )
          );

        updated++;
      });
    }

    return { usersProcessed: updated };
  }
);
