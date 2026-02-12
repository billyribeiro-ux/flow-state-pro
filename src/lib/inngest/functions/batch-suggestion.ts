import { inngest } from "../client";
import { db } from "@/lib/db";
import { tasks, coachingMessages } from "@/lib/db/schema";
import { eq, and, sql, isNull } from "drizzle-orm";

export const batchSuggestion = inngest.createFunction(
  { id: "batch-suggestion", name: "Batch Suggestion Engine" },
  { event: "task/created" },
  async ({ event, step }) => {
    const { userId, taskId, batchCategory } = event.data;

    if (!batchCategory) return { suggested: false };

    const suggestion = await step.run("check-category-count", async () => {
      const [result] = await db
        .select({ count: sql<number>`count(*)` })
        .from(tasks)
        .where(
          and(
            eq(tasks.userId, userId),
            eq(tasks.batchCategory, batchCategory),
            sql`${tasks.status} IN ('inbox', 'active')`,
            isNull(tasks.deletedAt)
          )
        );

      return {
        count: result?.count ?? 0,
        category: batchCategory,
      };
    });

    if (suggestion.count >= 3) {
      await step.run("suggest-batch", async () => {
        // Check cooldown: don't send if we already suggested in the last 2 hours
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
        const [recent] = await db
          .select({ count: sql<number>`count(*)` })
          .from(coachingMessages)
          .where(
            and(
              eq(coachingMessages.userId, userId),
              sql`${coachingMessages.sentAt} >= ${twoHoursAgo}`,
              sql`${coachingMessages.metadata}->>'triggerId' = 'batch.pattern_detected'`
            )
          );

        if ((recent?.count ?? 0) > 0) return;

        const estimatedSavings = Math.round(suggestion.count * 8);

        await db.insert(coachingMessages).values({
          userId,
          methodology: "batch",
          messageType: "nudge",
          trigger: "event",
          title: "Batch Opportunity",
          body: `You have ${suggestion.count} ${suggestion.category} tasks. Batching them into one session could save you ${estimatedSavings} minutes of context switching.`,
          actionUrl: "/techniques/batch",
          actionLabel: "Create Batch",
          priority: "medium",
          channel: "in_app",
          status: "sent",
          sentAt: new Date(),
          metadata: {
            triggerId: "batch.pattern_detected",
            category: suggestion.category,
            taskCount: suggestion.count,
          },
        });
      });

      return { suggested: true, category: suggestion.category, count: suggestion.count };
    }

    return { suggested: false };
  }
);
