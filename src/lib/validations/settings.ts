import { z } from "zod";
import { methodologySchema } from "./shared";

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().max(100).optional(),
  timezone: z.string().max(50).optional(),
});

export const updateCoachingPreferencesSchema = z.object({
  morningBriefEnabled: z.boolean().optional(),
  morningBriefTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  nudgeFrequency: z.enum(["off", "low", "medium", "high"]).optional(),
  weeklyReviewEnabled: z.boolean().optional(),
  weeklyReviewDay: z.enum(["monday", "friday", "sunday"]).optional(),
  coachingTone: z.enum(["encouraging", "direct", "analytical"]).optional(),
});

export const updateNotificationSettingsSchema = z.object({
  pushEnabled: z.boolean().optional(),
  emailDigestEnabled: z.boolean().optional(),
  emailFrequency: z.enum(["daily", "weekly", "never"]).optional(),
  sessionReminders: z.boolean().optional(),
  streakAlerts: z.boolean().optional(),
  coachingNudges: z.boolean().optional(),
});

export const updateTimerSettingsSchema = z.object({
  pomodoroDuration: z.number().int().min(300).max(3600).optional(), // 5-60 min
  shortBreakDuration: z.number().int().min(60).max(900).optional(), // 1-15 min
  longBreakDuration: z.number().int().min(300).max(1800).optional(), // 5-30 min
  pomodorosPerSet: z.number().int().min(2).max(8).optional(),
  autoStartBreaks: z.boolean().optional(),
  autoStartPomodoros: z.boolean().optional(),
  soundEnabled: z.boolean().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateCoachingPreferencesInput = z.infer<typeof updateCoachingPreferencesSchema>;
export type UpdateNotificationSettingsInput = z.infer<typeof updateNotificationSettingsSchema>;
export type UpdateTimerSettingsInput = z.infer<typeof updateTimerSettingsSchema>;
