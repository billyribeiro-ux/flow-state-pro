import { inngest } from "../client";
import { db } from "@/lib/db";
import { timeBlocks, coachingMessages, users } from "@/lib/db/schema";
import { eq, and, gte, lte, isNull, sql } from "drizzle-orm";

export const timeBlockUpcoming = inngest.createFunction(
  { id: "time-block-upcoming", name: "Time Block Upcoming Notification" },
  { cron: "*/5 * * * *" },
  async ({ step }) => {
    const upcomingBlocks = await step.run("find-upcoming-blocks", async () => {
      const now = new Date();
      const fiveMinLater = new Date(now.getTime() + 5 * 60 * 1000);

      return db
        .select({
          id: timeBlocks.id,
          userId: timeBlocks.userId,
          title: timeBlocks.title,
          methodology: timeBlocks.methodology,
          startTime: timeBlocks.startTime,
          blockType: timeBlocks.blockType,
        })
        .from(timeBlocks)
        .where(
          and(
            gte(timeBlocks.startTime, now),
            lte(timeBlocks.startTime, fiveMinLater),
            isNull(timeBlocks.deletedAt)
          )
        );
    });

    let notified = 0;

    for (const block of upcomingBlocks) {
      await step.run(`notify-block-${block.id}`, async () => {
        const methodologyLabel = block.methodology
          ? block.methodology.replace(/_/g, " ")
          : "focus";

        await db.insert(coachingMessages).values({
          userId: block.userId,
          methodology: block.methodology,
          messageType: "nudge",
          trigger: "scheduled",
          title: `${block.title ?? "Time Block"} Starting Soon`,
          body: `Your ${methodologyLabel} block starts in 5 minutes. Close distractions, get your workspace ready, and prepare to focus.`,
          actionUrl: "/techniques/time-blocking",
          actionLabel: "View Block",
          priority: "high",
          channel: "push",
          status: "sent",
          sentAt: new Date(),
          metadata: { triggerId: "time_blocking.upcoming_block", blockId: block.id },
        });

        notified++;
      });
    }

    return { blocksNotified: notified };
  }
);
