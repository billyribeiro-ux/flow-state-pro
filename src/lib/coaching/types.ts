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
  firstName: string | null;
  timezone: string;
  activeMethodology: MethodologyId | null;
  unlockedMethodologies: MethodologyId[];
  coachingTone: CoachingTone;
  nudgeFrequency: NudgeFrequency;
  quietHoursStart: string | null;
  quietHoursEnd: string | null;
  morningBriefTime: string;
  streakCurrent: number;
  streakLongest: number;
  todaysSessions: number;
  todaysFocusMinutes: number;
  todaysPomodorosCompleted: number;
  pendingTasks: number;
  frogStatus: "not_set" | "set" | "in_progress" | "completed";
  frogTitle: string | null;
  unprocessedInboxItems: number;
  activeTimer: boolean;
  totalFocusMinutes: number;
  totalTasksCompleted: number;
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

export interface MethodologyMetadata {
  id: MethodologyId;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  color: string;
  colorLight: string;
  creator: string;
  keyBenefit: string;
  idealFor: string[];
  videoDescription: string;
  onboardingHook: string;
}

export interface MilestoneDef {
  key: string;
  label: string;
  description: string;
  threshold: number;
  field: string;
  methodology?: MethodologyId;
  icon: string;
}
