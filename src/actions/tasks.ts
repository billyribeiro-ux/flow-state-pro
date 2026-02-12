"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { tasks } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function createTask(data: {
  title: string;
  priority?: string;
  dueDate?: string;
  methodology?: string;
  tags?: string[];
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [task] = await db
    .insert(tasks)
    .values({
      userId: session.user.id,
      title: data.title,
      priority: data.priority ?? "medium",
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      methodology: data.methodology ?? null,
      tags: data.tags ?? [],
      status: "pending",
    })
    .returning();

  revalidatePath("/dashboard");
  return task;
}

export async function updateTask(
  taskId: string,
  data: Partial<{
    title: string;
    priority: string;
    status: string;
    dueDate: string | null;
    methodology: string | null;
    tags: string[];
    completedAt: string | null;
  }>
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const updates: Record<string, unknown> = { ...data };
  if (data.dueDate !== undefined) {
    updates.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  }
  if (data.completedAt !== undefined) {
    updates.completedAt = data.completedAt ? new Date(data.completedAt) : null;
  }

  const [task] = await db
    .update(tasks)
    .set(updates)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, session.user.id)))
    .returning();

  revalidatePath("/dashboard");
  return task;
}

export async function toggleTask(taskId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [existing] = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, session.user.id)))
    .limit(1);

  if (!existing) throw new Error("Task not found");

  const isCompleting = existing.status !== "completed";

  const [task] = await db
    .update(tasks)
    .set({
      status: isCompleting ? "completed" : "pending",
      completedAt: isCompleting ? new Date() : null,
    })
    .where(eq(tasks.id, taskId))
    .returning();

  revalidatePath("/dashboard");
  return task;
}

export async function deleteTask(taskId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db
    .delete(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, session.user.id)));

  revalidatePath("/dashboard");
}
