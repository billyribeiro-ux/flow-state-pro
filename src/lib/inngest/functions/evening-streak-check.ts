import { inngest } from "../client";
import { db } from "@/lib/db";
import { users, sessions, coachingMessages } from "@/lib/db/schema";
import { eq, and, gte, sql } from "drizzle-orm";

export const eveningStreakCheck = inngest.createFunction(
  { id: "evening-streak-check", name: "Evening Streak Check" },
  { cron: "*/15 * * * *" }, // Every 15 min to match timezone windows
  async ({ step }) => {
    const atRiskUsers = await step.run("find-at-risk-users", async () => {
      // Find users with active streaks >= 3 who haven't logged a session today
      const streakUsers = await db
        .select({
          id: users.id,
          streakCurrent: users.streakCurrent,
          timezone: users.timezone,
        })
        .from(users)
        .where(
          and(
            eq(users.onboardingCompleted, true),
            sql`${users.streakCurrent} >= 3`
          )
        );

      const now = new Date();
      const results: { id: string; streakCurrent: number }[] = [];

      for (const user of streakUsers) {
        // Check if it's between 8pm-9pm in user's timezone
        const tz = user.timezone ?? "UTC";
        let userHour: number;
        try {
          const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone: tz,
            hour: "numeric",
            hour12: false,
          });
          userHour = parseInt(formatter.format(now), 10);
        } catch {
          userHour = now.getUTCHours();
        }

        if (userHour < 20 || userHour >= 21) continue;

        // Check if user has any sessions today
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);

        const [sessionCount] = await db
          .select({ count: sql<number>`count(*)` })
          .from(sessions)
          .where(
            and(
              eq(sessions.userId, user.id),
              gte(sessions.startedAt, todayStart)
            )
          );

        if ((sessionCount?.count ?? 0) === 0) {
          results.push({
            id: user.id,
            streakCurrent: user.streakCurrent ?? 0,
          });
        }
      }

      return results;
    });

    let warned = 0;

    for (const user of atRiskUsers) {
      await step.run(`warn-streak-${user.id}`, async () => {
        // Check cooldown: don't send if we already warned today
        const twentyHoursAgo = new Date(Date.now() - 20 * 60 * 60 * 1000);
        const [recent] = await db
          .select({ count: sql<number>`count(*)` })
          .from(coachingMessages)
          .where(
            and(
              eq(coachingMessages.userId, user.id),
              sql`${coachingMessages.sentAt} >= ${twentyHoursAgo}`,
              sql`${coachingMessages.metadata}->>'triggerId' = 'cross.streak_at_risk'`
            )
          );

        if ((recent?.count ?? 0) > 0) return;

        await db.insert(coachingMessages).values({
          userId: user.id,
          messageType: "nudge",
          trigger: "scheduled",
          title: `${user.streakCurrent}-Day Streak at Risk`,
          body: `You haven't logged a session today and your ${user.streakCurrent}-day streak is about to break. Even one Pomodoro or a 2-minute task burst keeps it alive.`,
          actionUrl: "/dashboard",
          actionLabel: "Quick Session",
          priority: "critical",
          channel: "push",
          status: "sent",
          sentAt: new Date(),
          metadata: { triggerId: "cross.streak_at_risk", streakCurrent: user.streakCurrent },
        });

        warned++;
      });
    }

    return { usersWarned: warned };
  }
);
