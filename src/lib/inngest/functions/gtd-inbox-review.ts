import { inngest } from "../client";
import { db } from "@/lib/db";
import { users, tasks, methodologyProgress, coachingMessages } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";

export const gtdInboxReview = inngest.createFunction(
  { id: "gtd-inbox-review", name: "GTD Inbox Review Reminder" },
  { cron: "0 9-17 * * 1-5" }, // Hourly 9am-5pm weekdays (UTC)
  async ({ step }) => {
    const usersWithFullInboxes = await step.run("find-users-with-full-inboxes", async () => {
      const gtdUsers = await db
        .select({
          userId: methodologyProgress.userId,
        })
        .from(methodologyProgress)
        .where(
          and(
            eq(methodologyProgress.methodology, "gtd"),
            sql`${methodologyProgress.status} IN ('active', 'mastered')`
          )
        );

      const results: { userId: string; inboxCount: number }[] = [];

      for (const { userId } of gtdUsers) {
        const [count] = await db
          .select({ count: sql<number>`count(*)` })
          .from(tasks)
          .where(
            and(
              eq(tasks.userId, userId),
              eq(tasks.gtdStatus, "inbox"),
              eq(tasks.status, "inbox")
            )
          );

        if ((count?.count ?? 0) > 5) {
          results.push({ userId, inboxCount: count?.count ?? 0 });
        }
      }

      return results;
    });

    let nudged = 0;

    for (const { userId, inboxCount } of usersWithFullInboxes) {
      await step.run(`nudge-gtd-${userId}`, async () => {
        // Check cooldown: don't send if we already sent one in the last 4 hours
        const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
        const [recent] = await db
          .select({ count: sql<number>`count(*)` })
          .from(coachingMessages)
          .where(
            and(
              eq(coachingMessages.userId, userId),
              sql`${coachingMessages.sentAt} >= ${fourHoursAgo}`,
              sql`${coachingMessages.metadata}->>'triggerId' = 'gtd.inbox_pileup'`
            )
          );

        if ((recent?.count ?? 0) > 0) return;

        await db.insert(coachingMessages).values({
          userId,
          methodology: "gtd",
          messageType: "nudge",
          trigger: "scheduled",
          title: "GTD Inbox Piling Up",
          body: `You have ${inboxCount} unprocessed items in your GTD inbox. Each one is an open loop draining mental energy. Take 10 minutes to process: delete, delegate, defer, or do.`,
          actionUrl: "/techniques/gtd",
          actionLabel: "Process Inbox",
          priority: "medium",
          channel: "in_app",
          status: "sent",
          sentAt: new Date(),
          metadata: { triggerId: "gtd.inbox_pileup", inboxCount },
        });

        nudged++;
      });
    }

    return { usersNudged: nudged };
  }
);
