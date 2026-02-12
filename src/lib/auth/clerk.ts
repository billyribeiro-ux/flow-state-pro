import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getAuthUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

export async function getDbUser() {
  const clerkId = await getAuthUserId();
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (!user) throw new Error("User not found in database");
  return user;
}

export async function getOrCreateDbUser() {
  const clerkId = await getAuthUserId();
  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Clerk user not found");

  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (existing) return existing;

  const [newUser] = await db
    .insert(users)
    .values({
      clerkId,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      avatarUrl: clerkUser.imageUrl,
    })
    .returning();

  return newUser!;
}
