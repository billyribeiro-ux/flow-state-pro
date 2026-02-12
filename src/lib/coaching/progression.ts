import { db } from "@/lib/db";
import { methodologyProgress, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export type MethodologySlug =
  | "pomodoro"
  | "eisenhower"
  | "time-blocking"
  | "two-minute"
  | "gtd"
  | "deep-work"
  | "eat-the-frog"
  | "pareto"
  | "batch"
  | "time-audit";

interface UnlockCriteria {
  methodology: MethodologySlug;
  requires: MethodologySlug;
  minSessions: number;
  minMasteryScore: number;
}

const PROGRESSION_MAP: UnlockCriteria[] = [
  { methodology: "eisenhower", requires: "pomodoro", minSessions: 5, minMasteryScore: 20 },
  { methodology: "time-blocking", requires: "pomodoro", minSessions: 5, minMasteryScore: 20 },
  { methodology: "two-minute", requires: "pomodoro", minSessions: 3, minMasteryScore: 15 },
  { methodology: "gtd", requires: "eisenhower", minSessions: 10, minMasteryScore: 40 },
  { methodology: "deep-work", requires: "time-blocking", minSessions: 10, minMasteryScore: 40 },
  { methodology: "eat-the-frog", requires: "eisenhower", minSessions: 8, minMasteryScore: 30 },
  { methodology: "pareto", requires: "gtd", minSessions: 15, minMasteryScore: 50 },
  { methodology: "batch", requires: "two-minute", minSessions: 10, minMasteryScore: 35 },
  { methodology: "time-audit", requires: "time-blocking", minSessions: 15, minMasteryScore: 50 },
];

const STARTER_METHODOLOGIES: MethodologySlug[] = ["pomodoro"];

export async function checkAndUnlockMethodologies(userId: string): Promise<MethodologySlug[]> {
  const progress = await db
    .select()
    .from(methodologyProgress)
    .where(eq(methodologyProgress.userId, userId));

  const progressMap = new Map(
    progress.map((p) => [p.methodology, p])
  );

  const newlyUnlocked: MethodologySlug[] = [];

  for (const criteria of PROGRESSION_MAP) {
    const target = progressMap.get(criteria.methodology);
    if (target && target.status !== "locked") continue;

    const prereq = progressMap.get(criteria.requires);
    if (!prereq) continue;

    if (
      prereq.sessionsCompleted >= criteria.minSessions &&
      prereq.masteryScore >= criteria.minMasteryScore
    ) {
      if (target) {
        await db
          .update(methodologyProgress)
          .set({ status: "available", unlockedAt: new Date(), updatedAt: new Date() })
          .where(
            and(
              eq(methodologyProgress.userId, userId),
              eq(methodologyProgress.methodology, criteria.methodology)
            )
          );
      } else {
        await db.insert(methodologyProgress).values({
          userId,
          methodology: criteria.methodology,
          status: "available",
          unlockedAt: new Date(),
        });
      }
      newlyUnlocked.push(criteria.methodology);
    }
  }

  return newlyUnlocked;
}

export async function initializeUserMethodologies(userId: string): Promise<void> {
  for (const methodology of STARTER_METHODOLOGIES) {
    await db
      .insert(methodologyProgress)
      .values({
        userId,
        methodology,
        status: "available",
        unlockedAt: new Date(),
      })
      .onConflictDoNothing();
  }

  for (const criteria of PROGRESSION_MAP) {
    await db
      .insert(methodologyProgress)
      .values({
        userId,
        methodology: criteria.methodology,
        status: "locked",
      })
      .onConflictDoNothing();
  }
}

export function getProgressionMap(): UnlockCriteria[] {
  return PROGRESSION_MAP;
}

export function getStarterMethodologies(): MethodologySlug[] {
  return [...STARTER_METHODOLOGIES];
}
