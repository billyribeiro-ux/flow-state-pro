import { create } from "zustand";
import type { TimerState, TimerType, TimerSettings } from "@/types/timer";
import type { MethodologyId } from "@/lib/constants/methodologies";
import { DEFAULT_TIMER_SETTINGS } from "@/types/timer";

interface TimerStore extends TimerState {
  settings: TimerSettings;
  intervalId: ReturnType<typeof setInterval> | null;

  // Actions
  startTimer: (params: {
    sessionId: string;
    methodology: MethodologyId;
    type: TimerType;
    durationSeconds: number;
    pomodoroCycle?: number;
    pomodoroSet?: number;
  }) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  tick: () => void;
  resetTimer: () => void;
  updateSettings: (settings: Partial<TimerSettings>) => void;
  syncFromServer: (state: Partial<TimerState>) => void;
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  // Initial state
  sessionId: null,
  methodology: null,
  type: "focus",
  status: "idle",
  startedAt: null,
  pausedAt: null,
  durationSeconds: 0,
  elapsedSeconds: 0,
  totalPauseSeconds: 0,
  pomodoroCycle: 1,
  pomodoroSet: 1,
  settings: DEFAULT_TIMER_SETTINGS,
  intervalId: null,

  startTimer: ({ sessionId, methodology, type, durationSeconds, pomodoroCycle, pomodoroSet }) => {
    const existing = get().intervalId;
    if (existing) clearInterval(existing);

    const intervalId = setInterval(() => {
      get().tick();
    }, 1000);

    set({
      sessionId,
      methodology,
      type,
      status: "running",
      startedAt: new Date().toISOString(),
      pausedAt: null,
      durationSeconds,
      elapsedSeconds: 0,
      totalPauseSeconds: 0,
      pomodoroCycle: pomodoroCycle ?? 1,
      pomodoroSet: pomodoroSet ?? 1,
      intervalId,
    });
  },

  pauseTimer: () => {
    const { intervalId } = get();
    if (intervalId) clearInterval(intervalId);

    set({
      status: "paused",
      pausedAt: new Date().toISOString(),
      intervalId: null,
    });
  },

  resumeTimer: () => {
    const { pausedAt, totalPauseSeconds } = get();
    let additionalPause = 0;
    if (pausedAt) {
      additionalPause = Math.floor(
        (Date.now() - new Date(pausedAt).getTime()) / 1000
      );
    }

    const intervalId = setInterval(() => {
      get().tick();
    }, 1000);

    set({
      status: "running",
      pausedAt: null,
      totalPauseSeconds: totalPauseSeconds + additionalPause,
      intervalId,
    });
  },

  stopTimer: () => {
    const { intervalId } = get();
    if (intervalId) clearInterval(intervalId);

    set({
      status: "completed",
      intervalId: null,
    });
  },

  tick: () => {
    const { elapsedSeconds, durationSeconds, status } = get();
    if (status !== "running") return;

    const newElapsed = elapsedSeconds + 1;
    if (newElapsed >= durationSeconds) {
      get().stopTimer();
      return;
    }

    set({ elapsedSeconds: newElapsed });
  },

  resetTimer: () => {
    const { intervalId } = get();
    if (intervalId) clearInterval(intervalId);

    set({
      sessionId: null,
      methodology: null,
      type: "focus",
      status: "idle",
      startedAt: null,
      pausedAt: null,
      durationSeconds: 0,
      elapsedSeconds: 0,
      totalPauseSeconds: 0,
      intervalId: null,
    });
  },

  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));
  },

  syncFromServer: (serverState) => {
    set((state) => ({ ...state, ...serverState }));
  },
}));
