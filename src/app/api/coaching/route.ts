import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { getDbUser } from "@/lib/auth/clerk";
import { db } from "@/lib/db";
import { coachingConversations, coachingMessages } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { buildCoachingSystemPrompt } from "@/lib/coaching/prompts/system";
import type { UserContext } from "@/lib/coaching/types";

export async function POST(request: NextRequest) {
  try {
    const user = await getDbUser();
    const { messages, conversationId } = await request.json();

    const ctx: UserContext = {
      userId: user.id,
      timezone: user.timezone ?? "UTC",
      activeMethodology: (user.activeMethodology as UserContext["activeMethodology"]) ?? null,
      coachingTone: (user.coachingPreferences as Record<string, string>)?.tone as UserContext["coachingTone"] ?? "encouraging",
      nudgeFrequency: (user.coachingPreferences as Record<string, string>)?.nudge_frequency as UserContext["nudgeFrequency"] ?? "moderate",
      quietHoursStart: (user.coachingPreferences as Record<string, string>)?.quiet_hours_start ?? null,
      quietHoursEnd: (user.coachingPreferences as Record<string, string>)?.quiet_hours_end ?? null,
      morningBriefTime: (user.coachingPreferences as Record<string, string>)?.morning_brief_time ?? "07:00",
      streakCurrent: user.currentStreak ?? 0,
      todaysSessions: 0,
      todaysFocusMinutes: user.totalFocusMinutes ?? 0,
      pendingTasks: 0,
      frogStatus: "not_set",
      unprocessedInboxItems: 0,
      activeTimer: false,
    };

    const systemPrompt = buildCoachingSystemPrompt(ctx);

    const result = streamText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: systemPrompt,
      messages,
      maxTokens: 500,
      temperature: 0.7,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Coaching API error:", error);
    return NextResponse.json(
      { error: "Failed to process coaching request" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await getDbUser();

    const conversations = await db
      .select()
      .from(coachingConversations)
      .where(eq(coachingConversations.userId, user.id))
      .limit(20);

    const unreadMessages = await db
      .select()
      .from(coachingMessages)
      .where(
        and(
          eq(coachingMessages.userId, user.id),
          eq(coachingMessages.status, "sent")
        )
      )
      .limit(10);

    return NextResponse.json({ conversations, unreadMessages });
  } catch (error) {
    console.error("Coaching GET error:", error);
    return NextResponse.json({ error: "Failed to fetch coaching data" }, { status: 500 });
  }
}
