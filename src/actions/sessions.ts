"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { focusSessions } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function startSession(data: {
  methodology: string;
  plannedDurationMinutes: number;
  taskId?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [focusSession] = await db
    .insert(focusSessions)
    .values({
      userId: session.user.id,
      methodology: data.methodology,
      plannedDuration: data.plannedDurationMinutes * 60,
      taskId: data.taskId ?? null,
      status: "active",
      startedAt: new Date(),
    })
    .returning();

  revalidatePath("/dashboard");
  return focusSession;
}

export async function completeSession(sessionId: string, data?: {
  focusScore?: number;
  distractionCount?: number;
  notes?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [focusSession] = await db
    .update(focusSessions)
    .set({
      status: "completed",
      completedAt: new Date(),
      focusScore: data?.focusScore ?? null,
      distractionCount: data?.distractionCount ?? 0,
      notes: data?.notes ?? null,
    })
    .where(and(eq(focusSessions.id, sessionId), eq(focusSessions.userId, session.user.id)))
    .returning();

  revalidatePath("/dashboard");
  revalidatePath("/analytics");
  return focusSession;
}

export async function cancelSession(sessionId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [focusSession] = await db
    .update(focusSessions)
    .set({
      status: "cancelled",
      completedAt: new Date(),
    })
    .where(and(eq(focusSessions.id, sessionId), eq(focusSessions.userId, session.user.id)))
    .returning();

  revalidatePath("/dashboard");
  return focusSession;
}

export async function pauseSession(sessionId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [focusSession] = await db
    .update(focusSessions)
    .set({ status: "paused" })
    .where(and(eq(focusSessions.id, sessionId), eq(focusSessions.userId, session.user.id)))
    .returning();

  return focusSession;
}

export async function resumeSession(sessionId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [focusSession] = await db
    .update(focusSessions)
    .set({ status: "active" })
    .where(and(eq(focusSessions.id, sessionId), eq(focusSessions.userId, session.user.id)))
    .returning();

  return focusSession;
}
