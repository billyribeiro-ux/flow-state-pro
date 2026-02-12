import { db } from "@/lib/db";
import { coachingMessages } from "@/lib/db/schema";
import { eq, and, gte, sql } from "drizzle-orm";
import { sendPushToUser } from "@/lib/notifications/push";
import { DELIVERY_STRATEGY } from "./delivery-strategy";
import { getTriggersForEvent } from "./triggers";
import type { UserContext, CoachingTriggerDef, CoachingChannel } from "./types";

/**
 * Parse ISO 8601 duration string to milliseconds.
 * Supports: PT{n}M, PT{n}H, P{n}D
 */
function parseDuration(iso: string): number {
  const match = iso.match(/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/);
  if (!match) return 0;
  const days = parseInt(match[1] ?? "0", 10);
  const hours = parseInt(match[2] ?? "0", 10);
  const minutes = parseInt(match[3] ?? "0", 10);
  const seconds = parseInt(match[4] ?? "0", 10);
  return ((days * 24 + hours) * 60 + minutes) * 60 * 1000 + seconds * 1000;
}

/**
 * Check if a trigger is within its cooldown period for a user.
 */
async function isOnCooldown(userId: string, triggerId: string, cooldown: string): Promise<boolean> {
  const cooldownMs = parseDuration(cooldown);
  if (cooldownMs <= 0) return false;

  const since = new Date(Date.now() - cooldownMs);

  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(coachingMessages)
    .where(
      and(
        eq(coachingMessages.userId, userId),
        gte(coachingMessages.sentAt, since),
        sql`${coachingMessages.metadata}->>'triggerId' = ${triggerId}`
      )
    );

  return (result?.count ?? 0) > 0;
}

/**
 * Check if user is within quiet hours.
 */
function isQuietHours(ctx: UserContext): boolean {
  if (!ctx.quietHoursStart || !ctx.quietHoursEnd) return false;

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;

  const [startH, startM] = ctx.quietHoursStart.split(":").map(Number);
  const [endH, endM] = ctx.quietHoursEnd.split(":").map(Number);
  const quietStart = (startH ?? 22) * 60 + (startM ?? 0);
  const quietEnd = (endH ?? 7) * 60 + (endM ?? 0);

  if (quietStart > quietEnd) {
    return currentTime >= quietStart || currentTime < quietEnd;
  }
  return currentTime >= quietStart && currentTime < quietEnd;
}

/**
 * Check rate limits for the user based on their nudge frequency.
 */
async function checkRateLimits(ctx: UserContext): Promise<boolean> {
  const maxHour = DELIVERY_STRATEGY.maxPerHour[ctx.nudgeFrequency];
  const maxDay = DELIVERY_STRATEGY.maxPerDay[ctx.nudgeFrequency];

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [hourlyResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(coachingMessages)
    .where(
      and(
        eq(coachingMessages.userId, ctx.userId),
        gte(coachingMessages.sentAt, oneHourAgo)
      )
    );

  if ((hourlyResult?.count ?? 0) >= maxHour) return false;

  const [dailyResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(coachingMessages)
    .where(
      and(
        eq(coachingMessages.userId, ctx.userId),
        gte(coachingMessages.sentAt, oneDayAgo)
      )
    );

  if ((dailyResult?.count ?? 0) >= maxDay) return false;

  return true;
}

/**
 * Deliver a coaching message via the appropriate channels.
 */
async function deliverMessage(
  ctx: UserContext,
  trigger: CoachingTriggerDef,
  eventData: Record<string, unknown>
): Promise<boolean> {
  const message = trigger.messageTemplate(ctx, eventData);
  const channels = DELIVERY_STRATEGY.channelPriority[trigger.priority];

  // Determine which channels to use (intersection of trigger channels and priority channels)
  const activeChannels = trigger.channels.filter((c) =>
    channels.includes(c)
  ) as CoachingChannel[];

  if (activeChannels.length === 0) {
    activeChannels.push(channels[0]);
  }

  for (const channel of activeChannels) {
    await db.insert(coachingMessages).values({
      userId: ctx.userId,
      methodology: trigger.methodology === "cross_methodology" ? null : trigger.methodology,
      messageType: "nudge",
      trigger: "event",
      title: message.title,
      body: message.body,
      actionUrl: message.actionUrl ?? null,
      actionLabel: message.actionLabel ?? null,
      priority: trigger.priority,
      channel,
      status: "sent",
      sentAt: new Date(),
      metadata: { triggerId: trigger.id, eventData },
    });

    if (channel === "push") {
      await sendPushToUser(ctx.userId, {
        title: message.title,
        body: message.body,
        tag: `trigger-${trigger.id}`,
        data: { url: message.actionUrl },
        actions: message.actionLabel
          ? [{ action: "open", title: message.actionLabel }]
          : undefined,
      });
    }
  }

  return true;
}

/**
 * Evaluate all triggers for a given event and user context.
 * Returns the IDs of triggers that fired.
 */
export async function evaluateTriggers(
  event: string,
  ctx: UserContext,
  eventData: Record<string, unknown> = {}
): Promise<string[]> {
  const triggers = getTriggersForEvent(event);
  const firedTriggers: string[] = [];

  // Check rate limits once
  const withinLimits = await checkRateLimits(ctx);
  if (!withinLimits) return firedTriggers;

  const quiet = isQuietHours(ctx);

  for (const trigger of triggers) {
    // Skip if quiet hours and not an exception
    if (quiet && !DELIVERY_STRATEGY.quietHoursExceptions.includes(trigger.priority)) {
      continue;
    }

    // Check methodology match
    if (
      trigger.methodology !== "cross_methodology" &&
      ctx.activeMethodology !== trigger.methodology
    ) {
      continue;
    }

    // Check condition
    try {
      if (!trigger.condition(ctx, eventData)) continue;
    } catch {
      continue;
    }

    // Check cooldown
    const onCooldown = await isOnCooldown(ctx.userId, trigger.id, trigger.cooldown);
    if (onCooldown) continue;

    // Deliver
    const delivered = await deliverMessage(ctx, trigger, eventData);
    if (delivered) {
      firedTriggers.push(trigger.id);
    }

    // Re-check rate limits after each delivery
    const stillWithinLimits = await checkRateLimits(ctx);
    if (!stillWithinLimits) break;
  }

  return firedTriggers;
}
