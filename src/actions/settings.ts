"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { userSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function updateProfile(data: {
  name?: string;
  email?: string;
  timezone?: string;
  avatarUrl?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [settings] = await db
    .update(userSettings)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(userSettings.userId, session.user.id))
    .returning();

  revalidatePath("/settings");
  return settings;
}

export async function updateTimerPreferences(data: {
  focusDuration?: number;
  shortBreakDuration?: number;
  longBreakDuration?: number;
  sessionsBeforeLongBreak?: number;
  autoStartBreaks?: boolean;
  autoStartFocus?: boolean;
  soundEnabled?: boolean;
  soundVolume?: number;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [settings] = await db
    .update(userSettings)
    .set({
      timerPreferences: data,
      updatedAt: new Date(),
    })
    .where(eq(userSettings.userId, session.user.id))
    .returning();

  revalidatePath("/settings");
  return settings;
}

export async function updateNotificationPreferences(data: {
  emailDigest?: boolean;
  pushNotifications?: boolean;
  streakReminders?: boolean;
  coachingNudges?: boolean;
  weeklyReport?: boolean;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [settings] = await db
    .update(userSettings)
    .set({
      notificationPreferences: data,
      updatedAt: new Date(),
    })
    .where(eq(userSettings.userId, session.user.id))
    .returning();

  revalidatePath("/settings");
  return settings;
}

export async function updateCoachingPreferences(data: {
  coachingStyle?: "gentle" | "balanced" | "intense";
  preferredMethodology?: string;
  dailyGoalMinutes?: number;
  weeklyGoalSessions?: number;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [settings] = await db
    .update(userSettings)
    .set({
      coachingPreferences: data,
      updatedAt: new Date(),
    })
    .where(eq(userSettings.userId, session.user.id))
    .returning();

  revalidatePath("/settings");
  return settings;
}

export async function updateAppearance(data: {
  theme?: "light" | "dark" | "system";
  accentColor?: string;
  compactMode?: boolean;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [settings] = await db
    .update(userSettings)
    .set({
      appearance: data,
      updatedAt: new Date(),
    })
    .where(eq(userSettings.userId, session.user.id))
    .returning();

  revalidatePath("/settings");
  return settings;
}
