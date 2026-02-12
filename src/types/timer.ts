import type { MethodologyId } from "@/lib/constants/methodologies";

export type TimerStatus = "idle" | "running" | "paused" | "completed";

export type TimerType =
  | "focus"
  | "break"
  | "short_break"
  | "long_break"
  | "deep_work";

export interface TimerState {
  sessionId: string | null;
  methodology: MethodologyId | null;
  type: TimerType;
  status: TimerStatus;
  startedAt: string | null;
  pausedAt: string | null;
  durationSeconds: number;
  elapsedSeconds: number;
  totalPauseSeconds: number;
  pomodoroCycle: number;
  pomodoroSet: number;
}

export interface TimerSettings {
  focusDuration: number; // minutes
  breakDuration: number;
  longBreakDuration: number;
  cyclesBeforeLongBreak: number;
  autoStartBreak: boolean;
  autoStartFocus: boolean;
  soundEnabled: boolean;
}

export const DEFAULT_TIMER_SETTINGS: TimerSettings = {
  focusDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  cyclesBeforeLongBreak: 4,
  autoStartBreak: false,
  autoStartFocus: false,
  soundEnabled: true,
};

export interface RedisTimerState {
  session_id: string;
  methodology: string;
  type: TimerType;
  status: "running" | "paused";
  started_at: string;
  paused_at: string | null;
  duration_seconds: string;
  elapsed_seconds: string;
  total_pause_seconds: string;
}
