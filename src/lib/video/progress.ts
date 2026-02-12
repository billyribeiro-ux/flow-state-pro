import { db } from "@/lib/db";
import { videoProgress } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function getVideoProgress(
  userId: string,
  methodology: string,
  muxAssetId: string
) {
  const [progress] = await db
    .select()
    .from(videoProgress)
    .where(
      and(
        eq(videoProgress.userId, userId),
        eq(videoProgress.methodology, methodology),
        eq(videoProgress.muxAssetId, muxAssetId)
      )
    )
    .limit(1);
  return progress ?? null;
}

export async function updateVideoProgress(
  userId: string,
  methodology: string,
  muxAssetId: string,
  data: {
    watchPercentage: number;
    totalWatchTime: number;
    lastPosition: number;
  }
) {
  const completed = data.watchPercentage >= 90;

  await db
    .insert(videoProgress)
    .values({
      userId,
      methodology,
      muxAssetId,
      watchPercentage: data.watchPercentage,
      totalWatchTime: data.totalWatchTime,
      lastPosition: data.lastPosition,
      completed,
      completedAt: completed ? new Date() : null,
    })
    .onConflictDoUpdate({
      target: [videoProgress.userId, videoProgress.methodology, videoProgress.muxAssetId],
      set: {
        watchPercentage: data.watchPercentage,
        totalWatchTime: data.totalWatchTime,
        lastPosition: data.lastPosition,
        completed,
        completedAt: completed ? new Date() : undefined,
        updatedAt: new Date(),
      },
    });
}

export async function getUserVideoProgress(userId: string, methodology?: string) {
  const conditions = [eq(videoProgress.userId, userId)];
  if (methodology) {
    conditions.push(eq(videoProgress.methodology, methodology));
  }

  return db
    .select()
    .from(videoProgress)
    .where(and(...conditions));
}

export async function getMethodologyVideoCompletion(
  userId: string,
  methodology: string
): Promise<number> {
  const progress = await getUserVideoProgress(userId, methodology);
  if (progress.length === 0) return 0;

  const totalPercentage = progress.reduce((sum, p) => sum + (p.watchPercentage ?? 0), 0);
  return Math.round(totalPercentage / progress.length);
}
