"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { timeAuditEntries } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function createTimeEntry(data: {
  categoryId: string;
  categoryLabel: string;
  durationSeconds: number;
  date?: string;
  notes?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [entry] = await db
    .insert(timeAuditEntries)
    .values({
      userId: session.user.id,
      categoryId: data.categoryId,
      categoryLabel: data.categoryLabel,
      durationSeconds: data.durationSeconds,
      date: data.date ? new Date(data.date) : new Date(),
      notes: data.notes ?? null,
    })
    .returning();

  revalidatePath("/techniques/time-audit");
  revalidatePath("/analytics");
  return entry;
}

export async function updateTimeEntry(
  entryId: string,
  data: Partial<{
    categoryId: string;
    categoryLabel: string;
    durationSeconds: number;
    notes: string | null;
  }>
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [entry] = await db
    .update(timeAuditEntries)
    .set(data)
    .where(and(eq(timeAuditEntries.id, entryId), eq(timeAuditEntries.userId, session.user.id)))
    .returning();

  revalidatePath("/techniques/time-audit");
  return entry;
}

export async function deleteTimeEntry(entryId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db
    .delete(timeAuditEntries)
    .where(and(eq(timeAuditEntries.id, entryId), eq(timeAuditEntries.userId, session.user.id)));

  revalidatePath("/techniques/time-audit");
}
