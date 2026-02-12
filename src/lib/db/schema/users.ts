import {
  boolean,
  date,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { methodologyEnum, userRoleEnum } from "./enums";

export interface CoachingPreferences {
  tone: "encouraging" | "direct" | "analytical" | "motivational";
  nudge_frequency: "aggressive" | "moderate" | "minimal";
  quiet_hours_start: string | null;
  quiet_hours_end: string | null;
  morning_brief_time: string;
  weekly_review_day: number;
}

export interface NotificationSettings {
  push_enabled: boolean;
  email_digest: boolean;
  email_frequency: "daily" | "weekly" | "none";
  sound_enabled: boolean;
}

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: varchar("clerk_id", { length: 255 }).unique().notNull(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    firstName: varchar("first_name", { length: 100 }),
    lastName: varchar("last_name", { length: 100 }),
    avatarUrl: text("avatar_url"),
    timezone: varchar("timezone", { length: 50 }).default("UTC"),
    role: userRoleEnum("role").default("user"),
    onboardingCompleted: boolean("onboarding_completed").default(false),
    activeMethodology: methodologyEnum("active_methodology"),
    coachingPreferences: jsonb("coaching_preferences")
      .default({
        tone: "encouraging",
        nudge_frequency: "moderate",
        quiet_hours_start: "22:00",
        quiet_hours_end: "07:00",
        morning_brief_time: "07:00",
        weekly_review_day: 0,
      })
      .$type<CoachingPreferences>(),
    notificationSettings: jsonb("notification_settings")
      .default({
        push_enabled: true,
        email_digest: true,
        email_frequency: "daily",
        sound_enabled: true,
      })
      .$type<NotificationSettings>(),
    streakCurrent: integer("streak_current").default(0),
    streakLongest: integer("streak_longest").default(0),
    streakLastActive: date("streak_last_active"),
    totalFocusMinutes: integer("total_focus_minutes").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("uq_users_clerk_id").on(table.clerkId),
    uniqueIndex("uq_users_email").on(table.email),
  ]
);
