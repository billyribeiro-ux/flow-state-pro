import { db } from "@/lib/db";
import { coachingMessages, coachingConversations } from "@/lib/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";

export async function getUnreadCoachingMessages(userId: string) {
  return db
    .select()
    .from(coachingMessages)
    .where(
      and(
        eq(coachingMessages.userId, userId),
        sql`${coachingMessages.status} IN ('sent', 'delivered')`
      )
    )
    .orderBy(desc(coachingMessages.sentAt))
    .limit(20);
}

export async function getLatestDailyBrief(userId: string) {
  const [brief] = await db
    .select()
    .from(coachingMessages)
    .where(
      and(
        eq(coachingMessages.userId, userId),
        eq(coachingMessages.messageType, "daily_brief")
      )
    )
    .orderBy(desc(coachingMessages.sentAt))
    .limit(1);
  return brief ?? null;
}

export async function getCoachingConversation(conversationId: string, userId: string) {
  const [conversation] = await db
    .select()
    .from(coachingConversations)
    .where(
      and(
        eq(coachingConversations.id, conversationId),
        eq(coachingConversations.userId, userId)
      )
    )
    .limit(1);
  return conversation ?? null;
}

export async function getRecentConversations(userId: string, limit = 10) {
  return db
    .select()
    .from(coachingConversations)
    .where(eq(coachingConversations.userId, userId))
    .orderBy(desc(coachingConversations.updatedAt))
    .limit(limit);
}

export async function markMessageRead(messageId: string, userId: string) {
  await db
    .update(coachingMessages)
    .set({ status: "read", readAt: new Date(), updatedAt: new Date() })
    .where(
      and(eq(coachingMessages.id, messageId), eq(coachingMessages.userId, userId))
    );
}

export async function markMessageDismissed(messageId: string, userId: string) {
  await db
    .update(coachingMessages)
    .set({ status: "dismissed", dismissedAt: new Date(), updatedAt: new Date() })
    .where(
      and(eq(coachingMessages.id, messageId), eq(coachingMessages.userId, userId))
    );
}
