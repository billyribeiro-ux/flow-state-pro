"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { timeBlocks } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function createTimeBlock(data: {
  title: string;
  startTime: string;
  endTime: string;
  color?: string;
  taskId?: string;
  methodology?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [block] = await db
    .insert(timeBlocks)
    .values({
      userId: session.user.id,
      title: data.title,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      color: data.color ?? "#6366f1",
      taskId: data.taskId ?? null,
      methodology: data.methodology ?? null,
    })
    .returning();

  revalidatePath("/dashboard");
  return block;
}

export async function updateTimeBlock(
  blockId: string,
  data: Partial<{
    title: string;
    startTime: string;
    endTime: string;
    color: string;
    taskId: string | null;
    completed: boolean;
  }>
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const updates: Record<string, unknown> = {};
  if (data.title !== undefined) updates.title = data.title;
  if (data.startTime) updates.startTime = new Date(data.startTime);
  if (data.endTime) updates.endTime = new Date(data.endTime);
  if (data.color !== undefined) updates.color = data.color;
  if (data.taskId !== undefined) updates.taskId = data.taskId;
  if (data.completed !== undefined) updates.completed = data.completed;

  const [block] = await db
    .update(timeBlocks)
    .set(updates)
    .where(and(eq(timeBlocks.id, blockId), eq(timeBlocks.userId, session.user.id)))
    .returning();

  revalidatePath("/dashboard");
  return block;
}

export async function deleteTimeBlock(blockId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db
    .delete(timeBlocks)
    .where(and(eq(timeBlocks.id, blockId), eq(timeBlocks.userId, session.user.id)));

  revalidatePath("/dashboard");
}
