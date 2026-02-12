import { redis } from "./client";
import type { RedisTimerState, TimerType } from "@/types/timer";
import type { MethodologyId } from "@/lib/constants/methodologies";

const TIMER_KEY = (userId: string) => `timer:${userId}`;
const TIMER_TTL = 86400; // 24 hours

export async function getTimerState(
  userId: string
): Promise<RedisTimerState | null> {
  const data = await redis.hgetall(TIMER_KEY(userId));
  if (!data || Object.keys(data).length === 0) return null;
  return data as unknown as RedisTimerState;
}

export async function setTimerState(
  userId: string,
  state: {
    sessionId: string;
    methodology: MethodologyId;
    type: TimerType;
    status: "running" | "paused";
    startedAt: string;
    pausedAt: string | null;
    durationSeconds: number;
    elapsedSeconds: number;
    totalPauseSeconds: number;
  }
): Promise<void> {
  const key = TIMER_KEY(userId);
  await redis.hset(key, {
    session_id: state.sessionId,
    methodology: state.methodology,
    type: state.type,
    status: state.status,
    started_at: state.startedAt,
    paused_at: state.pausedAt ?? "",
    duration_seconds: String(state.durationSeconds),
    elapsed_seconds: String(state.elapsedSeconds),
    total_pause_seconds: String(state.totalPauseSeconds),
  });
  await redis.expire(key, TIMER_TTL);
}

export async function updateTimerStatus(
  userId: string,
  status: "running" | "paused",
  pausedAt?: string | null
): Promise<void> {
  const fields: Record<string, string> = { status };
  if (pausedAt !== undefined) {
    fields.paused_at = pausedAt ?? "";
  }
  await redis.hset(TIMER_KEY(userId), fields);
}

export async function updateTimerElapsed(
  userId: string,
  elapsedSeconds: number,
  totalPauseSeconds: number
): Promise<void> {
  await redis.hset(TIMER_KEY(userId), {
    elapsed_seconds: String(elapsedSeconds),
    total_pause_seconds: String(totalPauseSeconds),
  });
}

export async function clearTimerState(userId: string): Promise<void> {
  await redis.del(TIMER_KEY(userId));
}
