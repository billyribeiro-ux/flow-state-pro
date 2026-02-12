import type { MethodologyId } from "@/lib/constants/methodologies";

export type CoachingTone =
  | "encouraging"
  | "direct"
  | "analytical"
  | "motivational";

export type NudgeFrequency = "aggressive" | "moderate" | "minimal";

export type CoachingChannel = "in_app" | "push" | "email";

export type CoachingPriority = "low" | "medium" | "high" | "critical";

export type CoachingMessageType =
  | "nudge"
  | "insight"
  | "reminder"
  | "celebration"
  | "warning"
  | "daily_brief"
  | "weekly_review"
  | "suggestion"
  | "unlock";

export interface CoachingNudge {
  id: string;
  title: string;
  body: string;
  methodology: MethodologyId | null;
  priority: CoachingPriority;
  actionUrl?: string;
  actionLabel?: string;
  createdAt: string;
}

export interface SSEEvent {
  type:
    | "timer.tick"
    | "timer.complete"
    | "coaching.nudge"
    | "task.updated"
    | "methodology.unlocked"
    | "streak.updated"
    | "notification";
  data: Record<string, unknown>;
}
