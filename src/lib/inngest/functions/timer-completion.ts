import { inngest } from "../client";
import { db } from "@/lib/db";
import { methodologyProgress, dailyAnalytics, users } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";

export const timerCompletion = inngest.createFunction(
  { id: "timer-completion", name: "Timer Completion Workflow" },
  { event: "session/completed" },
  async ({ event, step }) => {
    const { userId, sessionId, methodology, sessionType, actualDuration } =
      event.data;

    // Step 1: Update methodology stats
    await step.run("update-methodology-stats", async () => {
      const durationMinutes = Math.floor(actualDuration / 60);

      await db
        .update(methodologyProgress)
        .set({
          totalSessions: sql`total_sessions + 1`,
          totalMinutes: sql`total_minutes + ${durationMinutes}`,
          lastSessionAt: new Date(),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(methodologyProgress.userId, userId),
            eq(methodologyProgress.methodology, methodology as "pomodoro")
          )
        );
    });

    // Step 2: Update daily analytics
    await step.run("update-daily-analytics", async () => {
      const today = new Date().toISOString().split("T")[0]!;
      const durationMinutes = Math.floor(actualDuration / 60);
      const isPomodoroFocus = methodology === "pomodoro" && sessionType === "focus";

      await db
        .insert(dailyAnalytics)
        .values({
          userId,
          date: today,
          totalFocusMinutes: sessionType === "focus" ? durationMinutes : 0,
          totalBreakMinutes: sessionType !== "focus" ? durationMinutes : 0,
          sessionsCompleted: 1,
          pomodorosCompleted: isPomodoroFocus ? 1 : 0,
        })
        .onConflictDoUpdate({
          target: [dailyAnalytics.userId, dailyAnalytics.date],
          set: {
            totalFocusMinutes:
              sessionType === "focus"
                ? sql`daily_analytics.total_focus_minutes + ${durationMinutes}`
                : sql`daily_analytics.total_focus_minutes`,
            totalBreakMinutes:
              sessionType !== "focus"
                ? sql`daily_analytics.total_break_minutes + ${durationMinutes}`
                : sql`daily_analytics.total_break_minutes`,
            sessionsCompleted: sql`daily_analytics.sessions_completed + 1`,
            pomodorosCompleted: isPomodoroFocus
              ? sql`daily_analytics.pomodoros_completed + 1`
              : sql`daily_analytics.pomodoros_completed`,
            updatedAt: new Date(),
          },
        });
    });

    // Step 3: Update streak
    await step.run("update-streak", async () => {
      const today = new Date().toISOString().split("T")[0]!;

      const [user] = await db
        .select({
          streakCurrent: users.streakCurrent,
          streakLongest: users.streakLongest,
          streakLastActive: users.streakLastActive,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user) return;

      const lastActive = user.streakLastActive;
      const isNewDay = lastActive !== today;

      if (isNewDay) {
        const newStreak = (user.streakCurrent ?? 0) + 1;
        const newLongest = Math.max(newStreak, user.streakLongest ?? 0);

        await db
          .update(users)
          .set({
            streakCurrent: newStreak,
            streakLongest: newLongest,
            streakLastActive: today,
            totalFocusMinutes: sql`total_focus_minutes + ${Math.floor(actualDuration / 60)}`,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userId));
      } else {
        await db
          .update(users)
          .set({
            totalFocusMinutes: sql`total_focus_minutes + ${Math.floor(actualDuration / 60)}`,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userId));
      }
    });

    return { success: true, sessionId };
  }
);
