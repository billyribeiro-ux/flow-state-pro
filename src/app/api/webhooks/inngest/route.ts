import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { timerCompletion } from "@/lib/inngest/functions/timer-completion";
import { dailyCoachingDigest } from "@/lib/inngest/functions/daily-coaching-digest";
import { weeklyReviewCompile } from "@/lib/inngest/functions/weekly-review-compile";
import { progressiveUnlock } from "@/lib/inngest/functions/progressive-unlock";
import { analyticsAggregate } from "@/lib/inngest/functions/analytics-aggregate";
import { streakCalculator } from "@/lib/inngest/functions/streak-calculator";
import { morningFrogReminder } from "@/lib/inngest/functions/morning-frog-reminder";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    timerCompletion,
    dailyCoachingDigest,
    weeklyReviewCompile,
    progressiveUnlock,
    analyticsAggregate,
    streakCalculator,
    morningFrogReminder,
  ],
});
