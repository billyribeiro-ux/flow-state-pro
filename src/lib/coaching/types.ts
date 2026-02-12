/**
 * Coaching Engine Types
 * Derived from coaching-engine.ts specification.
 */

export type CoachingChannel = "in_app" | "push" | "email";
export type CoachingPriority = "low" | "medium" | "high" | "critical";
export type CoachingTone = "encouraging" | "direct" | "analytical" | "motivational";
export type NudgeFrequency = "aggressive" | "moderate" | "minimal";

export type MethodologyId =
  | "pomodoro"
  | "eisenhower"
  | "gtd"
  | "time_blocking"
  | "deep_work"
  | "eat_the_frog"
  | "two_minute"
  | "batch"
  | "pareto"
  | "time_audit";

export interface UserContext {
  userId: string;
  timezone: string;
  activeMethodology: MethodologyId | null;
  coachingTone: CoachingTone;
  nudgeFrequency: NudgeFrequency;
  quietHoursStart: string | null;
  quietHoursEnd: string | null;
  morningBriefTime: string;
  streakCurrent: number;
  todaysSessions: number;
  todaysFocusMinutes: number;
  pendingTasks: number;
  frogStatus: "not_set" | "set" | "in_progress" | "completed";
  unprocessedInboxItems: number;
  activeTimer: boolean;
}

export interface CoachingMessage {
  title: string;
  body: string;
  actionUrl?: string;
  actionLabel?: string;
}

export interface CoachingTriggerDef {
  id: string;
  event: string;
  methodology: MethodologyId | "cross_methodology";
  condition: (ctx: UserContext, eventData: Record<string, unknown>) => boolean;
  cooldown: string; // ISO 8601 duration: "PT30M", "PT2H", "P1D"
  priority: CoachingPriority;
  channels: CoachingChannel[];
  messageTemplate: (
    ctx: UserContext,
    eventData: Record<string, unknown>
  ) => CoachingMessage;
}

export interface UnlockRequirements {
  minDaysActive: number;
  minSessions: number;
  minMasteryScore: number;
  additionalConditions?: string[];
}

export interface DeliveryStrategy {
  maxPerHour: Record<NudgeFrequency, number>;
  maxPerDay: Record<NudgeFrequency, number>;
  channelPriority: Record<CoachingPriority, CoachingChannel[]>;
  quietHoursExceptions: CoachingPriority[];
}
