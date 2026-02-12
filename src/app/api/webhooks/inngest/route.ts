import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { timerCompletion } from "@/lib/inngest/functions/timer-completion";
import { dailyCoachingDigest } from "@/lib/inngest/functions/daily-coaching-digest";
import { weeklyReviewCompile } from "@/lib/inngest/functions/weekly-review-compile";
import { progressiveUnlock } from "@/lib/inngest/functions/progressive-unlock";
import { analyticsAggregate } from "@/lib/inngest/functions/analytics-aggregate";
import { weeklyAnalyticsAggregate } from "@/lib/inngest/functions/weekly-analytics-aggregate";
import { streakCalculator } from "@/lib/inngest/functions/streak-calculator";
import { morningFrogReminder } from "@/lib/inngest/functions/morning-frog-reminder";
import { timeBlockUpcoming } from "@/lib/inngest/functions/time-block-upcoming";
import { gtdInboxReview } from "@/lib/inngest/functions/gtd-inbox-review";
import { deepWorkSessionPrep } from "@/lib/inngest/functions/deep-work-session-prep";
import { batchSuggestion } from "@/lib/inngest/functions/batch-suggestion";
import { paretoWeeklyAnalysis } from "@/lib/inngest/functions/pareto-weekly-analysis";
import { videoCompletionCheck } from "@/lib/inngest/functions/video-completion-check";
import { eveningStreakCheck } from "@/lib/inngest/functions/evening-streak-check";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    timerCompletion,
    dailyCoachingDigest,
    weeklyReviewCompile,
    progressiveUnlock,
    analyticsAggregate,
    weeklyAnalyticsAggregate,
    streakCalculator,
    morningFrogReminder,
    timeBlockUpcoming,
    gtdInboxReview,
    deepWorkSessionPrep,
    batchSuggestion,
    paretoWeeklyAnalysis,
    videoCompletionCheck,
    eveningStreakCheck,
  ],
});
