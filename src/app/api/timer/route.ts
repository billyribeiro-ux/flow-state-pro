import { NextRequest, NextResponse } from "next/server";
import { getDbUser } from "@/lib/auth/clerk";
import { db } from "@/lib/db";
import { sessions } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { inngest } from "@/lib/inngest/client";

export async function POST(request: NextRequest) {
  try {
    const user = await getDbUser();
    const body = await request.json();
    const { action, sessionId, methodology, sessionType, plannedDuration } = body;

    switch (action) {
      case "start": {
        const [session] = await db
          .insert(sessions)
          .values({
            userId: user.id,
            methodology,
            sessionType,
            status: "active",
            plannedDuration,
            startedAt: new Date(),
          })
          .returning();

        return NextResponse.json({ session });
      }

      case "pause": {
        await db
          .update(sessions)
          .set({ status: "paused", updatedAt: new Date() })
          .where(and(eq(sessions.id, sessionId), eq(sessions.userId, user.id)));

        return NextResponse.json({ success: true });
      }

      case "resume": {
        await db
          .update(sessions)
          .set({ status: "active", updatedAt: new Date() })
          .where(and(eq(sessions.id, sessionId), eq(sessions.userId, user.id)));

        return NextResponse.json({ success: true });
      }

      case "complete": {
        const { actualDuration, pomodoroCount, distractionCount } = body;

        await db
          .update(sessions)
          .set({
            status: "completed",
            actualDuration,
            completedAt: new Date(),
            pomodoroCount,
            distractionCount,
            updatedAt: new Date(),
          })
          .where(and(eq(sessions.id, sessionId), eq(sessions.userId, user.id)));

        // Trigger post-completion processing
        await inngest.send({
          name: "session/completed",
          data: {
            userId: user.id,
            sessionId,
            methodology,
            sessionType,
            actualDuration,
            pomodoroCount: pomodoroCount ?? 0,
          },
        });

        return NextResponse.json({ success: true });
      }

      case "abandon": {
        await db
          .update(sessions)
          .set({ status: "abandoned", updatedAt: new Date() })
          .where(and(eq(sessions.id, sessionId), eq(sessions.userId, user.id)));

        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Timer API error:", error);
    return NextResponse.json({ error: "Timer operation failed" }, { status: 500 });
  }
}
