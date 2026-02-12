import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { timerCompletion } from "@/lib/inngest/functions/timer-completion";
import { dailyCoachingDigest } from "@/lib/inngest/functions/daily-coaching-digest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [timerCompletion, dailyCoachingDigest],
});
