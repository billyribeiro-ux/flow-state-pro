"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTimerStore } from "@/lib/stores/timer-store";

export function useTimer() {
  const store = useTimerStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (store.status === "running") {
      clearTimer();
      intervalRef.current = setInterval(() => {
        store.tick();
      }, 1000);
    } else {
      clearTimer();
    }

    return clearTimer;
  }, [store.status, store.tick, clearTimer]);

  // Sync with server on completion
  useEffect(() => {
    if (store.status === "completed" && store.sessionId) {
      fetch("/api/timer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "complete",
          sessionId: store.sessionId,
          methodology: store.methodology,
          sessionType: store.timerType,
          actualDuration: store.elapsed,
          pomodoroCount: store.currentCycle,
          distractionCount: 0,
        }),
      }).catch(console.error);
    }
  }, [store.status, store.sessionId, store.methodology, store.timerType, store.elapsed, store.currentCycle]);

  const start = useCallback(
    async (methodology: string, sessionType: string, duration: number) => {
      try {
        const res = await fetch("/api/timer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "start",
            methodology,
            sessionType,
            plannedDuration: duration,
          }),
        });
        const data = await res.json();
        if (data.session) {
          store.start(data.session.id, methodology, sessionType, duration);
        }
      } catch (error) {
        console.error("Failed to start session:", error);
        store.start(null, methodology, sessionType, duration);
      }
    },
    [store]
  );

  const pause = useCallback(async () => {
    store.pause();
    if (store.sessionId) {
      fetch("/api/timer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "pause", sessionId: store.sessionId }),
      }).catch(console.error);
    }
  }, [store]);

  const resume = useCallback(async () => {
    store.resume();
    if (store.sessionId) {
      fetch("/api/timer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resume", sessionId: store.sessionId }),
      }).catch(console.error);
    }
  }, [store]);

  const stop = useCallback(async () => {
    if (store.sessionId) {
      fetch("/api/timer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "abandon", sessionId: store.sessionId }),
      }).catch(console.error);
    }
    store.stop();
  }, [store]);

  return {
    ...store,
    start,
    pause,
    resume,
    stop,
    reset: store.reset,
  };
}
