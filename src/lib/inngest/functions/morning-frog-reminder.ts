import { inngest } from "../client";
import { db } from "@/lib/db";
import { users, tasks, coachingMessages } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export const morningFrogReminder = inngest.createFunction(
  { id: "morning-frog-reminder", name: "Morning Frog Reminder" },
  { cron: "0 7 * * *" }, // Every day at 7 AM
  async ({ step }) => {
    const frogUsers = await step.run("fetch-frog-users", async () => {
      return db
        .select({
          id: users.id,
          firstName: users.firstName,
          email: users.email,
          activeMethodology: users.activeMethodology,
        })
        .from(users)
        .where(
          and(
            eq(users.onboardingCompleted, true),
            eq(users.activeMethodology, "eat_the_frog")
          )
        );
    });

    let reminded = 0;

    for (const user of frogUsers) {
      await step.run(`remind-${user.id}`, async () => {
        const today = new Date().toISOString().split("T")[0]!;

        // Check if user has set a frog for today
        const [frog] = await db
          .select()
          .from(tasks)
          .where(
            and(
              eq(tasks.userId, user.id),
              eq(tasks.isFrog, true),
              eq(tasks.frogDate, today),
              isNull(tasks.deletedAt)
            )
          )
          .limit(1);

        const message = frog
          ? `Good morning! Your frog today is: "${frog.title}". Tackle it first thing — before anything else grabs your attention.`
          : `Good morning! You haven't set your frog for today yet. Head to Eat The Frog and pick the one task you're most likely to procrastinate on.`;

        await db.insert(coachingMessages).values({
          userId: user.id,
          methodology: "eat_the_frog",
          messageType: "nudge",
          trigger: "scheduled",
          title: frog ? "Time to Eat Your Frog" : "Set Your Frog for Today",
          body: message,
          actionUrl: "/techniques/eat-the-frog",
          actionLabel: frog ? "Start Frog" : "Set Frog",
          priority: frog ? "high" : "medium",
          channel: "in_app",
          status: "sent",
          sentAt: new Date(),
          metadata: { triggerId: "eat_the_frog.morning" },
        });

        reminded++;
      });
    }

    return { usersReminded: reminded };
  }
);
