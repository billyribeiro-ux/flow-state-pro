import { db } from "@/lib/db";
import { dailyAnalytics, weeklyAnalytics } from "@/lib/db/schema";
import { eq, and, desc, gte, lte, sql } from "drizzle-orm";

export async function getDailyAnalytics(userId: string, date: string) {
  const [result] = await db
    .select()
    .from(dailyAnalytics)
    .where(and(eq(dailyAnalytics.userId, userId), eq(dailyAnalytics.date, date)))
    .limit(1);
  return result ?? null;
}

export async function getDailyAnalyticsRange(
  userId: string,
  startDate: string,
  endDate: string
) {
  return db
    .select()
    .from(dailyAnalytics)
    .where(
      and(
        eq(dailyAnalytics.userId, userId),
        gte(dailyAnalytics.date, startDate),
        lte(dailyAnalytics.date, endDate)
      )
    )
    .orderBy(desc(dailyAnalytics.date));
}

export async function getWeeklyAnalytics(userId: string, weekStart: string) {
  const [result] = await db
    .select()
    .from(weeklyAnalytics)
    .where(
      and(eq(weeklyAnalytics.userId, userId), eq(weeklyAnalytics.weekStart, weekStart))
    )
    .limit(1);
  return result ?? null;
}

export async function getRecentWeeklyAnalytics(userId: string, weeks = 4) {
  return db
    .select()
    .from(weeklyAnalytics)
    .where(eq(weeklyAnalytics.userId, userId))
    .orderBy(desc(weeklyAnalytics.weekStart))
    .limit(weeks);
}

export async function getProductivityHeatmapData(userId: string, days = 90) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startStr = startDate.toISOString().split("T")[0]!;

  return db
    .select({
      date: dailyAnalytics.date,
      focusMinutes: dailyAnalytics.totalFocusMinutes,
      sessions: dailyAnalytics.sessionsCompleted,
    })
    .from(dailyAnalytics)
    .where(
      and(
        eq(dailyAnalytics.userId, userId),
        gte(dailyAnalytics.date, startStr)
      )
    )
    .orderBy(dailyAnalytics.date);
}

export async function getTotalFocusMinutesThisWeek(userId: string) {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const mondayStr = monday.toISOString().split("T")[0]!;

  const [result] = await db
    .select({
      total: sql<number>`COALESCE(SUM(${dailyAnalytics.totalFocusMinutes}), 0)`,
    })
    .from(dailyAnalytics)
    .where(
      and(
        eq(dailyAnalytics.userId, userId),
        gte(dailyAnalytics.date, mondayStr)
      )
    );
  return result?.total ?? 0;
}
