"use server";

import { db } from "@/lib/db";
import { users, methodologyProgress } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getDbUser } from "@/lib/auth/clerk";
import { methodologySchema } from "@/lib/validations/shared";

export async function selectMethodologyAction(methodology: string) {
  const parsed = methodologySchema.safeParse(methodology);
  if (!parsed.success) {
    throw new Error("Invalid methodology");
  }

  const user = await getDbUser();

  // Set active methodology on user
  await db
    .update(users)
    .set({
      activeMethodology: parsed.data,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  // Create methodology_progress entry as active
  await db
    .insert(methodologyProgress)
    .values({
      userId: user.id,
      methodology: parsed.data,
      status: "active",
      activatedAt: new Date(),
      unlockedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [methodologyProgress.userId, methodologyProgress.methodology],
      set: {
        status: "active",
        activatedAt: new Date(),
        updatedAt: new Date(),
      },
    });

  return { success: true };
}

export async function completeOnboardingAction() {
  const user = await getDbUser();

  await db
    .update(users)
    .set({
      onboardingCompleted: true,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  return { success: true };
}
