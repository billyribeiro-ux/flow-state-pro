import { inngest } from "../client";
import { db } from "@/lib/db";
import { videoProgress, users, methodologyProgress } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";

export const videoCompletionCheck = inngest.createFunction(
  { id: "video-completion-check", name: "Video Completion Check" },
  { event: "video/progress_updated" },
  async ({ event, step }) => {
    const { userId, methodology, muxAssetId, watchPercentage } = event.data;

    if (watchPercentage < 90) {
      return { completed: false, watchPercentage };
    }

    const result = await step.run("check-completion", async () => {
      // Mark video as completed
      await db
        .update(videoProgress)
        .set({
          completed: true,
          completedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(videoProgress.userId, userId),
            eq(videoProgress.muxAssetId, muxAssetId)
          )
        );

      // Update methodology progress videoWatched flag
      await db
        .update(methodologyProgress)
        .set({
          videoWatched: true,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(methodologyProgress.userId, userId),
            eq(methodologyProgress.methodology, methodology as "pomodoro")
          )
        );

      // Check if all onboarding videos are watched
      const [incomplete] = await db
        .select({ count: sql<number>`count(*)` })
        .from(videoProgress)
        .where(
          and(
            eq(videoProgress.userId, userId),
            eq(videoProgress.completed, false)
          )
        );

      const allWatched = (incomplete?.count ?? 0) === 0;

      if (allWatched) {
        // Check if user hasn't already completed onboarding
        const [user] = await db
          .select({ onboardingCompleted: users.onboardingCompleted })
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);

        if (user && !user.onboardingCompleted) {
          await db
            .update(users)
            .set({
              onboardingCompleted: true,
              updatedAt: new Date(),
            })
            .where(eq(users.id, userId));
        }
      }

      return { allVideosWatched: allWatched };
    });

    return { completed: true, methodology, ...result };
  }
);
