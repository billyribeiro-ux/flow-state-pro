import { inngest } from "../client";
import { db } from "@/lib/db";
import { users, coachingMessages, dailyAnalytics } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export const dailyCoachingDigest = inngest.createFunction(
  {
    id: "daily-coaching-digest",
    name: "Daily Coaching Digest",
  },
  { cron: "*/15 * * * *" },
  async ({ step }) => {
    // Step 1: Find users due for their morning brief
    const usersDue = await step.run("find-users-due-for-brief", async () => {
      const now = new Date();
      const currentHour = now.getUTCHours();
      const currentMinute = now.getUTCMinutes();
      const windowStart = currentHour * 60 + currentMinute - 7;
      const windowEnd = currentHour * 60 + currentMinute + 8;

      const allUsers = await db
        .select({
          id: users.id,
          firstName: users.firstName,
          activeMethodology: users.activeMethodology,
          coachingPreferences: users.coachingPreferences,
          streakCurrent: users.streakCurrent,
          timezone: users.timezone,
        })
        .from(users)
        .where(eq(users.onboardingCompleted, true));

      return allUsers.filter((user) => {
        const briefTime = user.coachingPreferences?.morning_brief_time ?? "07:00";
        const [hours, minutes] = briefTime.split(":").map(Number);
        const briefMinutes = (hours ?? 7) * 60 + (minutes ?? 0);
        return briefMinutes >= windowStart && briefMinutes <= windowEnd;
      });
    });

    // Step 2: Generate and deliver briefings
    for (const user of usersDue) {
      await step.run(`deliver-brief-${user.id}`, async () => {
        const [yesterday] = await db
          .select()
          .from(dailyAnalytics)
          .where(eq(dailyAnalytics.userId, user.id))
          .orderBy(desc(dailyAnalytics.date))
          .limit(1);

        const focusMinutes = yesterday?.totalFocusMinutes ?? 0;
        const sessionsCompleted = yesterday?.sessionsCompleted ?? 0;
        const methodology = user.activeMethodology ?? "general";

        const briefingBody = generateBriefing({
          firstName: user.firstName ?? "there",
          methodology,
          focusMinutes,
          sessionsCompleted,
          streak: user.streakCurrent ?? 0,
        });

        await db.insert(coachingMessages).values({
          userId: user.id,
          methodology: user.activeMethodology,
          messageType: "daily_brief",
          trigger: "scheduled",
          title: "Your Morning Briefing",
          body: briefingBody,
          priority: "high",
          channel: "in_app",
          status: "sent",
          sentAt: new Date(),
        });
      });
    }

    return { usersNotified: usersDue.length };
  }
);

function generateBriefing(ctx: {
  firstName: string;
  methodology: string;
  focusMinutes: number;
  sessionsCompleted: number;
  streak: number;
}): string {
  const greeting = `Good morning, ${ctx.firstName}.`;
  const yesterdaySummary =
    ctx.sessionsCompleted > 0
      ? `Yesterday: ${ctx.sessionsCompleted} sessions, ${ctx.focusMinutes} minutes of focus.`
      : "No sessions yesterday — today's a fresh start.";
  const streakNote =
    ctx.streak > 0
      ? `You're on a ${ctx.streak}-day streak. Keep it alive.`
      : "Start a new streak today with one focused session.";

  return `${greeting} ${yesterdaySummary} ${streakNote}`;
}
