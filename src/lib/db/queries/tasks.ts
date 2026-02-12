import { db } from "@/lib/db";
import { tasks } from "@/lib/db/schema";
import { eq, and, isNull, desc, asc, sql } from "drizzle-orm";

export async function getTasksByUser(
  userId: string,
  options?: { status?: string; limit?: number; offset?: number }
) {
  const conditions = [eq(tasks.userId, userId), isNull(tasks.deletedAt)];
  if (options?.status) {
    conditions.push(eq(tasks.status, options.status as typeof tasks.status.enumValues[number]));
  }

  return db
    .select()
    .from(tasks)
    .where(and(...conditions))
    .orderBy(asc(tasks.sortOrder), desc(tasks.createdAt))
    .limit(options?.limit ?? 50)
    .offset(options?.offset ?? 0);
}

export async function getTaskById(taskId: string, userId: string) {
  const [task] = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId), isNull(tasks.deletedAt)))
    .limit(1);
  return task ?? null;
}

export async function getEisenhowerTasks(userId: string) {
  return db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, userId),
        isNull(tasks.deletedAt),
        sql`${tasks.eisenhowerQuadrant} IS NOT NULL`
      )
    )
    .orderBy(asc(tasks.sortOrder));
}

export async function getTwoMinuteTasks(userId: string) {
  return db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, userId),
        eq(tasks.isTwoMinute, true),
        isNull(tasks.deletedAt)
      )
    )
    .orderBy(asc(tasks.sortOrder));
}

export async function getFrogTask(userId: string, date: string) {
  const [task] = await db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, userId),
        eq(tasks.isFrog, true),
        eq(tasks.frogDate, date),
        isNull(tasks.deletedAt)
      )
    )
    .limit(1);
  return task ?? null;
}

export async function getTasksByBatchCategory(userId: string, category: string) {
  return db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, userId),
        eq(tasks.batchCategory, category),
        isNull(tasks.deletedAt)
      )
    )
    .orderBy(asc(tasks.sortOrder));
}

export async function getGtdInboxTasks(userId: string) {
  return db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, userId),
        eq(tasks.gtdStatus, "inbox"),
        isNull(tasks.deletedAt)
      )
    )
    .orderBy(desc(tasks.createdAt));
}

export async function getCompletedTaskCount(userId: string, since: Date) {
  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, userId),
        eq(tasks.status, "completed"),
        sql`${tasks.completedAt} >= ${since}`
      )
    );
  return result?.count ?? 0;
}
