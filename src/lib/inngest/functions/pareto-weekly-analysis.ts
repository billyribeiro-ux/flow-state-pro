import { inngest } from "../client";
import { db } from "@/lib/db";
import { tasks, methodologyProgress, coachingMessages } from "@/lib/db/schema";
import { eq, and, gte, sql } from "drizzle-orm";

export const paretoWeeklyAnalysis = inngest.createFunction(
  { id: "pareto-weekly-analysis", name: "Pareto Weekly Analysis" },
  { cron: "0 17 * * 5" }, // Friday 5pm UTC
  async ({ step }) => {
    const paretoUsers = await step.run("find-users-with-pareto-active", async () => {
      const result = await db
        .select({ userId: methodologyProgress.userId })
        .from(methodologyProgress)
        .where(
          and(
            eq(methodologyProgress.methodology, "pareto"),
            sql`${methodologyProgress.status} IN ('active', 'mastered')`
          )
        );

      return result.map((r) => r.userId);
    });

    let analyzed = 0;

    for (const userId of paretoUsers) {
      await step.run(`pareto-analysis-${userId}`, async () => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        // Gather completed tasks with impact data
        const completedTasks = await db
          .select({
            id: tasks.id,
            title: tasks.title,
            impactScore: tasks.impactScore,
            effortScore: tasks.effortScore,
            batchCategory: tasks.batchCategory,
          })
          .from(tasks)
          .where(
            and(
              eq(tasks.userId, userId),
              eq(tasks.status, "completed"),
              gte(tasks.completedAt, weekAgo)
            )
          );

        if (completedTasks.length === 0) return;

        // Sort by impact score descending
        const sorted = completedTasks
          .filter((t) => t.impactScore != null)
          .sort((a, b) => (b.impactScore ?? 0) - (a.impactScore ?? 0));

        if (sorted.length === 0) return;

        // Calculate Pareto split
        const totalImpact = sorted.reduce((s, t) => s + (t.impactScore ?? 0), 0);
        let cumulativeImpact = 0;
        let topCount = 0;

        for (const task of sorted) {
          cumulativeImpact += task.impactScore ?? 0;
          topCount++;
          if (cumulativeImpact >= totalImpact * 0.8) break;
        }

        const topPercent = Math.round((topCount / sorted.length) * 100);
        const bottomCount = sorted.length - topCount;

        await db.insert(coachingMessages).values({
          userId,
          methodology: "pareto",
          messageType: "nudge",
          trigger: "scheduled",
          title: "Your 80/20 Report",
          body: `This week, ${topCount} activities generated 80% of your results. ${bottomCount} activities barely moved the needle. Top ${topPercent}% of tasks drove the majority of impact. Time to double down on what works.`,
          actionUrl: "/techniques/pareto",
          actionLabel: "View Analysis",
          priority: "high",
          channel: "in_app",
          status: "sent",
          sentAt: new Date(),
          metadata: {
            triggerId: "pareto.weekly_analysis",
            topActivitiesCount: topCount,
            bottomActivitiesCount: bottomCount,
            totalTasks: sorted.length,
            topPercent,
          },
        });

        analyzed++;
      });
    }

    return { usersAnalyzed: analyzed };
  }
);
