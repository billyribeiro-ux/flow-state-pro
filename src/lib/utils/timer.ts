export function secondsToMs(seconds: number): number {
  return seconds * 1000;
}

export function msToSeconds(ms: number): number {
  return Math.floor(ms / 1000);
}

export function minutesToSeconds(minutes: number): number {
  return minutes * 60;
}

export function secondsToMinutes(seconds: number): number {
  return Math.floor(seconds / 60);
}

export function calculateElapsed(startedAt: string, pausedDuration = 0): number {
  const start = new Date(startedAt).getTime();
  const now = Date.now();
  return msToSeconds(now - start) - pausedDuration;
}

export function calculateRemaining(durationSeconds: number, elapsed: number): number {
  return Math.max(0, durationSeconds - elapsed);
}

export function isTimerComplete(durationSeconds: number, elapsed: number): boolean {
  return elapsed >= durationSeconds;
}

export function formatTimerDisplay(totalSeconds: number): {
  minutes: string;
  seconds: string;
} {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return {
    minutes: String(mins).padStart(2, "0"),
    seconds: String(secs).padStart(2, "0"),
  };
}
