import { inngest } from "../client";
import { checkAndUnlockMethodologies } from "@/lib/coaching/progression";
import { sendSSEEvent } from "@/lib/notifications/sse";

export const progressiveUnlock = inngest.createFunction(
  { id: "progressive-unlock", name: "Progressive Methodology Unlock" },
  { event: "session/completed" },
  async ({ event, step }) => {
    const { userId } = event.data;

    const unlocked = await step.run("check-unlocks", async () => {
      return checkAndUnlockMethodologies(userId);
    });

    if (unlocked.length > 0) {
      await step.run("notify-user", async () => {
        for (const methodology of unlocked) {
          sendSSEEvent(userId, {
            type: "methodology_unlocked",
            data: { methodology },
          });
        }
      });

      await step.sendEvent(
        "send-unlock-events",
        unlocked.map((methodology) => ({
          name: "methodology/unlocked" as const,
          data: { userId, methodology },
        }))
      );
    }

    return { unlocked };
  }
);
