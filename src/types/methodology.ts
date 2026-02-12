import type { MethodologyId } from "@/lib/constants/methodologies";

export type MethodologyCategory =
  | "Execute"
  | "Capture"
  | "Prioritize"
  | "Optimize"
  | "Reflect";

export type MethodologyStatus = "locked" | "available" | "active" | "mastered";

export interface MethodologyState {
  id: MethodologyId;
  status: MethodologyStatus;
  masteryScore: number;
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  lastSessionAt: Date | null;
}

export interface MethodologyUnlockProgress {
  methodology: MethodologyId;
  daysActive: number;
  requiredDays: number;
  sessionsCompleted: number;
  requiredSessions: number;
  masteryScore: number;
  requiredMastery: number;
  additionalConditionsMet: boolean[];
  isReady: boolean;
}
