import { inngest } from "../client";
import { db } from "@/lib/db";
import { timeBlocks, coachingMessages } from "@/lib/db/schema";
import { eq, and, gte, lte, isNull, sql } from "drizzle-orm";

export const deepWorkSessionPrep = inngest.createFunction(
  { id: "deep-work-session-prep", name: "Deep Work Session Prep" },
  { cron: "*/5 * * * *" },
  async ({ step }) => {
    const upcomingDeepWork = await step.run("find-upcoming-deep-work", async () => {
      const now = new Date();
      const fiveMin = new Date(now.getTime() + 5 * 60 * 1000);
      const fifteenMin = new Date(now.getTime() + 15 * 60 * 1000);

      return db
        .select({
          id: timeBlocks.id,
          userId: timeBlocks.userId,
          title: timeBlocks.title,
          startTime: timeBlocks.startTime,
        })
        .from(timeBlocks)
        .where(
          and(
            eq(timeBlocks.methodology, "deep_work"),
            gte(timeBlocks.startTime, fiveMin),
            lte(timeBlocks.startTime, fifteenMin),
            isNull(timeBlocks.deletedAt)
          )
        );
    });

    let notified = 0;

    for (const block of upcomingDeepWork) {
      await step.run(`prep-deep-work-${block.id}`, async () => {
        // Check cooldown: don't send if we already sent a prep for this block
        const [recent] = await db
          .select({ count: sql<number>`count(*)` })
          .from(coachingMessages)
          .where(
            and(
              eq(coachingMessages.userId, block.userId),
              sql`${coachingMessages.metadata}->>'blockId' = ${block.id}`
            )
          );

        if ((recent?.count ?? 0) > 0) return;

        await db.insert(coachingMessages).values({
          userId: block.userId,
          methodology: "deep_work",
          messageType: "nudge",
          trigger: "scheduled",
          title: "Deep Work Starting Soon 🧠",
          body: `"${block.title ?? "Deep Work"}" starts in ~10 minutes. Prep now: close email, silence notifications, get water, set your environment. Once you start, commit to zero interruptions.`,
          actionUrl: "/techniques/deep-work",
          actionLabel: "Prepare",
          priority: "high",
          channel: "push",
          status: "sent",
          sentAt: new Date(),
          metadata: { triggerId: "deep_work.session_prep", blockId: block.id },
        });

        notified++;
      });
    }

    return { deepWorkPrepped: notified };
  }
);
