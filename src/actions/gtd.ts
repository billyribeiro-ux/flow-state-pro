"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { gtdItems } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";

type GtdBucket = "inbox" | "next-actions" | "waiting-for" | "projects" | "someday-maybe" | "reference";
type GtdContext = "anywhere" | "phone" | "computer" | "home" | "office" | "people";

export async function captureToInbox(data: { text: string }) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [item] = await db
    .insert(gtdItems)
    .values({
      userId: session.user.id,
      text: data.text,
      bucket: "inbox" as GtdBucket,
      createdAt: new Date(),
    })
    .returning();

  revalidatePath("/techniques/gtd");
  return item;
}

export async function processInboxItem(
  itemId: string,
  data: {
    bucket: GtdBucket;
    context?: GtdContext;
    projectId?: string;
    dueDate?: string;
  }
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const updates: Record<string, unknown> = {
    bucket: data.bucket,
    processedAt: new Date(),
  };
  if (data.context) updates.context = data.context;
  if (data.projectId) updates.projectId = data.projectId;
  if (data.dueDate) updates.dueDate = new Date(data.dueDate);

  const [item] = await db
    .update(gtdItems)
    .set(updates)
    .where(and(eq(gtdItems.id, itemId), eq(gtdItems.userId, session.user.id)))
    .returning();

  revalidatePath("/techniques/gtd");
  return item;
}

export async function completeGtdItem(itemId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [item] = await db
    .update(gtdItems)
    .set({
      status: "completed",
      completedAt: new Date(),
    })
    .where(and(eq(gtdItems.id, itemId), eq(gtdItems.userId, session.user.id)))
    .returning();

  revalidatePath("/techniques/gtd");
  return item;
}

export async function deleteGtdItem(itemId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db
    .delete(gtdItems)
    .where(and(eq(gtdItems.id, itemId), eq(gtdItems.userId, session.user.id)));

  revalidatePath("/techniques/gtd");
}
