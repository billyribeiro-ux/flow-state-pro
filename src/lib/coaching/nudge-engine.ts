import { db } from "@/lib/db";
import { coachingMessages, users } from "@/lib/db/schema";
import { eq, and, gte, sql } from "drizzle-orm";
import { sendPushToUser } from "@/lib/notifications/push";
import type { MethodologyId } from "@/lib/constants/methodologies";

export type NudgeTrigger =
  | "session_completed"
  | "session_abandoned"
  | "streak_at_risk"
  | "milestone_reached"
  | "inactivity"
  | "frog_not_eaten"
  | "inbox_overflow"
  | "time_block_missed";

interface NudgeContext {
  userId: string;
  trigger: NudgeTrigger;
  methodology?: MethodologyId;
  data?: Record<string, unknown>;
}

interface NudgeTemplate {
  title: string;
  body: string;
  actionUrl?: string;
  actionLabel?: string;
  priority: "low" | "medium" | "high" | "critical";
}

const POMODORO_NUDGES: Record<string, NudgeTemplate> = {
  session_completed: {
    title: "Great focus session!",
    body: "You just completed a Pomodoro. Take a 5-minute break — you've earned it.",
    actionUrl: "/techniques/pomodoro",
    actionLabel: "Start Break",
    priority: "medium",
  },
  session_abandoned: {
    title: "Session ended early",
    body: "It's okay — even partial focus counts. Try a shorter session next time if 25 minutes feels too long.",
    actionUrl: "/techniques/pomodoro/settings",
    actionLabel: "Adjust Settings",
    priority: "low",
  },
  streak_at_risk: {
    title: "Your streak is at risk!",
    body: "You haven't completed a session today. One Pomodoro is all it takes to keep your streak alive.",
    actionUrl: "/techniques/pomodoro",
    actionLabel: "Start Session",
    priority: "high",
  },
};

const EISENHOWER_NUDGES: Record<string, NudgeTemplate> = {
  inbox_overflow: {
    title: "Tasks need sorting",
    body: "You have unsorted tasks. Take 5 minutes to categorize them in your Eisenhower Matrix.",
    actionUrl: "/techniques/eisenhower",
    actionLabel: "Sort Tasks",
    priority: "medium",
  },
};

const TIME_BLOCKING_NUDGES: Record<string, NudgeTemplate> = {
  time_block_missed: {
    title: "Missed time block",
    body: "You had a focus block scheduled that wasn't started. Want to reschedule it?",
    actionUrl: "/techniques/time-blocking",
    actionLabel: "View Calendar",
    priority: "medium",
  },
};

const TWO_MINUTE_NUDGES: Record<string, NudgeTemplate> = {
  inactivity: {
    title: "Quick wins waiting",
    body: "You have quick tasks in your queue. Clear them in under 5 minutes.",
    actionUrl: "/techniques/two-minute",
    actionLabel: "Clear Queue",
    priority: "low",
  },
};

const CROSS_METHODOLOGY_NUDGES: Record<string, NudgeTemplate> = {
  milestone_reached: {
    title: "Milestone unlocked!",
    body: "You've reached a new milestone. Check your progress and see what's next.",
    actionUrl: "/dashboard",
    actionLabel: "View Progress",
    priority: "high",
  },
  inactivity: {
    title: "We miss you!",
    body: "It's been a while since your last session. Even 10 minutes of focused work makes a difference.",
    actionUrl: "/dashboard",
    actionLabel: "Get Started",
    priority: "medium",
  },
};

function getNudgeTemplate(
  trigger: NudgeTrigger,
  methodology?: MethodologyId
): NudgeTemplate | null {
  if (methodology) {
    const methodologyNudges: Record<string, Record<string, NudgeTemplate>> = {
      pomodoro: POMODORO_NUDGES,
      eisenhower: EISENHOWER_NUDGES,
      time_blocking: TIME_BLOCKING_NUDGES,
      two_minute: TWO_MINUTE_NUDGES,
    };
    const nudges = methodologyNudges[methodology];
    if (nudges?.[trigger]) return nudges[trigger];
  }

  return CROSS_METHODOLOGY_NUDGES[trigger] ?? null;
}

export async function shouldSendNudge(userId: string): Promise<boolean> {
  // Check rate limits: max 5 per hour, 15 per day
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [hourlyCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(coachingMessages)
    .where(
      and(
        eq(coachingMessages.userId, userId),
        gte(coachingMessages.sentAt, oneHourAgo)
      )
    );

  if ((hourlyCount?.count ?? 0) >= 5) return false;

  const [dailyCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(coachingMessages)
    .where(
      and(
        eq(coachingMessages.userId, userId),
        gte(coachingMessages.sentAt, oneDayAgo)
      )
    );

  if ((dailyCount?.count ?? 0) >= 15) return false;

  // Check quiet hours
  const [user] = await db
    .select({ coachingPreferences: users.coachingPreferences, timezone: users.timezone })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (user?.coachingPreferences) {
    const prefs = user.coachingPreferences;
    if (prefs.quiet_hours_start && prefs.quiet_hours_end) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTime = currentHour * 60 + currentMinute;

      const [startH, startM] = prefs.quiet_hours_start.split(":").map(Number);
      const [endH, endM] = prefs.quiet_hours_end.split(":").map(Number);
      const quietStart = (startH ?? 22) * 60 + (startM ?? 0);
      const quietEnd = (endH ?? 7) * 60 + (endM ?? 0);

      if (quietStart > quietEnd) {
        // Overnight quiet hours (e.g., 22:00 - 07:00)
        if (currentTime >= quietStart || currentTime < quietEnd) return false;
      } else {
        if (currentTime >= quietStart && currentTime < quietEnd) return false;
      }
    }
  }

  return true;
}

export async function sendNudge(context: NudgeContext): Promise<boolean> {
  const canSend = await shouldSendNudge(context.userId);
  if (!canSend) return false;

  const template = getNudgeTemplate(context.trigger, context.methodology);
  if (!template) return false;

  // Personalize body with data
  let body = template.body;
  if (context.data) {
    for (const [key, value] of Object.entries(context.data)) {
      body = body.replace(`{{${key}}}`, String(value));
    }
  }

  // Store in DB
  await db.insert(coachingMessages).values({
    userId: context.userId,
    methodology: context.methodology ?? null,
    messageType: "nudge",
    trigger: "event",
    title: template.title,
    body,
    actionUrl: template.actionUrl,
    actionLabel: template.actionLabel,
    priority: template.priority,
    channel: "in_app",
    status: "sent",
    sentAt: new Date(),
    metadata: context.data ?? {},
  });

  // Also send push notification for high priority
  if (template.priority === "high" || template.priority === "critical") {
    await sendPushToUser(context.userId, {
      title: template.title,
      body,
      tag: `nudge-${context.trigger}`,
      data: { url: template.actionUrl },
      actions: template.actionLabel
        ? [{ action: "open", title: template.actionLabel }]
        : undefined,
    });
  }

  return true;
}
