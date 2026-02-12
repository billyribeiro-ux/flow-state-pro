import { redis } from "./client";

const DEFAULT_TTL = 3600; // 1 hour

export async function cacheGet<T>(key: string): Promise<T | null> {
  const data = await redis.get(key);
  if (!data) return null;
  return data as T;
}

export async function cacheSet<T>(
  key: string,
  value: T,
  ttlSeconds = DEFAULT_TTL
): Promise<void> {
  await redis.set(key, JSON.stringify(value), { ex: ttlSeconds });
}

export async function cacheDelete(key: string): Promise<void> {
  await redis.del(key);
}

export async function cacheDeletePattern(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

export function userCacheKey(userId: string, namespace: string): string {
  return `cache:${namespace}:${userId}`;
}

export async function cacheDailyAnalytics(
  userId: string,
  date: string,
  data: Record<string, unknown>
): Promise<void> {
  await cacheSet(`cache:analytics:daily:${userId}:${date}`, data, 300);
}

export async function getCachedDailyAnalytics(
  userId: string,
  date: string
): Promise<Record<string, unknown> | null> {
  return cacheGet(`cache:analytics:daily:${userId}:${date}`);
}
