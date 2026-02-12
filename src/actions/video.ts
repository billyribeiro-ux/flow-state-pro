"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { videoProgress } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function updateVideoProgress(data: {
  videoId: string;
  currentTime: number;
  duration: number;
  completed?: boolean;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const progress = data.duration > 0 ? Math.round((data.currentTime / data.duration) * 100) : 0;
  const isComplete = data.completed ?? progress >= 95;

  const [entry] = await db
    .insert(videoProgress)
    .values({
      userId: session.user.id,
      videoId: data.videoId,
      currentTime: data.currentTime,
      duration: data.duration,
      progress,
      completed: isComplete,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [videoProgress.userId, videoProgress.videoId],
      set: {
        currentTime: data.currentTime,
        progress,
        completed: isComplete,
        updatedAt: new Date(),
      },
    })
    .returning();

  return entry;
}

export async function markVideoComplete(videoId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [entry] = await db
    .update(videoProgress)
    .set({
      completed: true,
      progress: 100,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(videoProgress.userId, session.user.id),
        eq(videoProgress.videoId, videoId)
      )
    )
    .returning();

  return entry;
}

export async function resetVideoProgress(videoId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [entry] = await db
    .update(videoProgress)
    .set({
      currentTime: 0,
      progress: 0,
      completed: false,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(videoProgress.userId, session.user.id),
        eq(videoProgress.videoId, videoId)
      )
    )
    .returning();

  return entry;
}
