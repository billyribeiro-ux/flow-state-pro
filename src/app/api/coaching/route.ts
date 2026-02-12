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

    const prefs = user.coachingPreferences as Record<string, string> | null;

    const ctx: UserContext = {
      userId: user.id,
      firstName: user.firstName ?? null,
      timezone: user.timezone ?? "UTC",
      activeMethodology: (user.activeMethodology as UserContext["activeMethodology"]) ?? null,
      unlockedMethodologies: [],
      coachingTone: (prefs?.tone as UserContext["coachingTone"]) ?? "encouraging",
      nudgeFrequency: (prefs?.nudge_frequency as UserContext["nudgeFrequency"]) ?? "moderate",
      quietHoursStart: prefs?.quiet_hours_start ?? null,
      quietHoursEnd: prefs?.quiet_hours_end ?? null,
      morningBriefTime: prefs?.morning_brief_time ?? "07:00",
      streakCurrent: user.streakCurrent ?? 0,
      streakLongest: user.streakLongest ?? 0,
      todaysSessions: 0,
      todaysFocusMinutes: 0,
      todaysPomodorosCompleted: 0,
      pendingTasks: 0,
      frogStatus: "not_set",
      frogTitle: null,
      unprocessedInboxItems: 0,
      activeTimer: false,
      totalFocusMinutes: user.totalFocusMinutes ?? 0,
      totalTasksCompleted: user.totalTasksCompleted ?? 0,
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
