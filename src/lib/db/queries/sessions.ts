import { db } from "@/lib/db";
import { sessions } from "@/lib/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";

export async function getSessionsByUser(
  userId: string,
  options?: { methodology?: string; limit?: number; offset?: number }
) {
  const conditions = [eq(sessions.userId, userId)];
  if (options?.methodology) {
    conditions.push(eq(sessions.methodology, options.methodology as typeof sessions.methodology.enumValues[number]));
  }

  return db
    .select()
    .from(sessions)
    .where(and(...conditions))
    .orderBy(desc(sessions.createdAt))
    .limit(options?.limit ?? 50)
    .offset(options?.offset ?? 0);
}

export async function getActiveSession(userId: string) {
  const [session] = await db
    .select()
    .from(sessions)
    .where(
      and(
        eq(sessions.userId, userId),
        sql`${sessions.status} IN ('active', 'paused')`
      )
    )
    .limit(1);
  return session ?? null;
}

export async function getSessionById(sessionId: string, userId: string) {
  const [session] = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.id, sessionId), eq(sessions.userId, userId)))
    .limit(1);
  return session ?? null;
}

export async function getTodaySessionCount(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(sessions)
    .where(
      and(
        eq(sessions.userId, userId),
        eq(sessions.status, "completed"),
        sql`${sessions.startedAt} >= ${today}`
      )
    );
  return result?.count ?? 0;
}

export async function getTodayFocusMinutes(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [result] = await db
    .select({
      total: sql<number>`COALESCE(SUM(EXTRACT(EPOCH FROM ${sessions.actualDuration}) / 60), 0)`,
    })
    .from(sessions)
    .where(
      and(
        eq(sessions.userId, userId),
        eq(sessions.status, "completed"),
        sql`${sessions.sessionType} IN ('focus', 'deep_work', 'frog', 'batch')`,
        sql`${sessions.startedAt} >= ${today}`
      )
    );
  return Math.round(result?.total ?? 0);
}
