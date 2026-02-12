/**
 * FlowState Pro — Coaching Engine Specification
 * The 24/7 AI productivity coach that watches, learns, and nudges.
 *
 * This file defines:
 * 1. All coaching triggers per methodology
 * 2. Message templates
 * 3. AI prompt templates for personalized coaching
 * 4. Cross-methodology intelligence queries
 * 5. Progressive unlock criteria
 * 6. Notification delivery strategy
 */

// ============================================================================
// TYPES
// ============================================================================

type MethodologyEnum = "pomodoro" | "gtd" | "eisenhower" | "time_blocking" | "deep_work" | "eat_the_frog" | "two_minute" | "batch" | "pareto" | "time_audit";

type CoachingChannel = "in_app" | "push" | "email";
type CoachingPriority = "low" | "medium" | "high" | "critical";
type CoachingTone = "encouraging" | "direct" | "analytical" | "motivational";

interface UserContext {
  userId: string;
  timezone: string;
  activeMethodology: MethodologyEnum | null;
  coachingTone: CoachingTone;
  nudgeFrequency: "aggressive" | "moderate" | "minimal";
  quietHoursStart: string | null; // "22:00"
  quietHoursEnd: string | null; // "07:00"
  morningBriefTime: string; // "07:00"
  streakCurrent: number;
  todaysSessions: number;
  todaysFocusMinutes: number;
  pendingTasks: number;
  frogStatus: "not_set" | "set" | "in_progress" | "completed";
  unprocessedInboxItems: number;
  activeTimer: boolean;
}

interface CoachingTriggerDef {
  id: string;
  event: string;
  methodology: MethodologyEnum | "cross_methodology";
  condition: (ctx: UserContext, eventData: Record<string, unknown>) => boolean;
  cooldown: string; // ISO duration: "PT30M" = 30 min, "PT2H" = 2 hours
  priority: CoachingPriority;
  channels: CoachingChannel[];
  messageTemplate: (
    ctx: UserContext,
    eventData: Record<string, unknown>
  ) => {
    title: string;
    body: string;
    actionUrl?: string;
    actionLabel?: string;
  };
}

// ============================================================================
// 1. COACHING TRIGGERS PER METHODOLOGY
// ============================================================================

/**
 * POMODORO TECHNIQUE
 * Trigger Points: session start, 5min warning, session end, break start,
 * break end, long break, daily summary, streak at risk
 */
const POMODORO_TRIGGERS: CoachingTriggerDef[] = [
  {
    id: "pomodoro.focus.starting",
    event: "session.started",
    methodology: "pomodoro",
    condition: (ctx, data) =>
      (data as { sessionType: string }).sessionType === "focus",
    cooldown: "PT25M",
    priority: "medium",
    channels: ["push", "in_app"],
    messageTemplate: (ctx) => ({
      title: "Focus Time 🎯",
      body: "25 minutes of pure focus. No distractions. You've got this.",
      actionUrl: "/techniques/pomodoro",
      actionLabel: "View Timer",
    }),
  },
  {
    id: "pomodoro.focus.five_remaining",
    event: "timer.five_minutes_remaining",
    methodology: "pomodoro",
    condition: () => true,
    cooldown: "PT25M",
    priority: "low",
    channels: ["in_app"],
    messageTemplate: () => ({
      title: "Final Stretch",
      body: "5 minutes left. Push through — finish what you started.",
    }),
  },
  {
    id: "pomodoro.focus.completed",
    event: "session.completed",
    methodology: "pomodoro",
    condition: (ctx, data) =>
      (data as { sessionType: string }).sessionType === "focus",
    cooldown: "PT1M",
    priority: "high",
    channels: ["push", "in_app"],
    messageTemplate: (ctx, data) => {
      const cycle = (data as { pomodoroCycle: number }).pomodoroCycle;
      const isLongBreak = cycle % 4 === 0;
      return {
        title: isLongBreak
          ? "Long Break Earned! 🏆"
          : "Break Time",
        body: isLongBreak
          ? `${cycle} Pomodoros complete. Take 15-30 minutes. Walk away from the screen. Hydrate.`
          : "Step away for 5 minutes. Stretch. Breathe. Your brain needs this.",
        actionUrl: "/techniques/pomodoro",
        actionLabel: "Start Break",
      };
    },
  },
  {
    id: "pomodoro.break.over",
    event: "session.completed",
    methodology: "pomodoro",
    condition: (ctx, data) =>
      ["break", "short_break", "long_break"].includes(
        (data as { sessionType: string }).sessionType
      ),
    cooldown: "PT1M",
    priority: "high",
    channels: ["push", "in_app"],
    messageTemplate: () => ({
      title: "Break's Over",
      body: "Recharged? Good. Time to lock back in.",
      actionUrl: "/techniques/pomodoro",
      actionLabel: "Start Focus",
    }),
  },
  {
    id: "pomodoro.daily_summary",
    event: "cron.end_of_day",
    methodology: "pomodoro",
    condition: (ctx) => ctx.todaysSessions > 0,
    cooldown: "PT20H",
    priority: "medium",
    channels: ["in_app", "push"],
    messageTemplate: (ctx) => ({
      title: "Day Complete",
      body: `You completed ${ctx.todaysSessions} Pomodoros today — that's ${ctx.todaysFocusMinutes} minutes of focused work. ${ctx.todaysSessions >= 8 ? "Outstanding performance." : ctx.todaysSessions >= 4 ? "Solid day." : "Tomorrow, aim for one more."}`,
      actionUrl: "/analytics",
      actionLabel: "View Stats",
    }),
  },
  {
    id: "pomodoro.session_abandoned",
    event: "session.abandoned",
    methodology: "pomodoro",
    condition: () => true,
    cooldown: "PT30M",
    priority: "low",
    channels: ["in_app"],
    messageTemplate: () => ({
      title: "Session Interrupted",
      body: "That's okay. Awareness is the first step. Want to try a shorter focus block? Even 15 minutes counts.",
      actionUrl: "/techniques/pomodoro/settings",
      actionLabel: "Adjust Duration",
    }),
  },
];

/**
 * EISENHOWER MATRIX
 * Trigger Points: task quadrant assignment, Q3 time warning,
 * too many Q1 tasks, weekly quadrant review
 */
const EISENHOWER_TRIGGERS: CoachingTriggerDef[] = [
  {
    id: "eisenhower.morning_sort",
    event: "cron.morning_brief",
    methodology: "eisenhower",
    condition: (ctx) => ctx.pendingTasks > 0,
    cooldown: "PT20H",
    priority: "high",
    channels: ["push", "in_app"],
    messageTemplate: (ctx) => ({
      title: "Morning Prioritization",
      body: `You have ${ctx.pendingTasks} tasks. Let's sort them — what's urgent AND important? Everything else can wait.`,
      actionUrl: "/techniques/eisenhower",
      actionLabel: "Open Matrix",
    }),
  },
  {
    id: "eisenhower.q3_warning",
    event: "time_audit.quadrant_check",
    methodology: "eisenhower",
    condition: (ctx, data) =>
      (data as { q3Minutes: number }).q3Minutes > 120,
    cooldown: "PT4H",
    priority: "high",
    channels: ["push", "in_app"],
    messageTemplate: (ctx, data) => ({
      title: "Priority Check ⚠️",
      body: `You've spent ${Math.round((data as { q3Minutes: number }).q3Minutes / 60)} hours on urgent-but-not-important work. Can you delegate or drop any of it?`,
      actionUrl: "/techniques/eisenhower",
      actionLabel: "Reprioritize",
    }),
  },
  {
    id: "eisenhower.q1_overload",
    event: "task.quadrant_assigned",
    methodology: "eisenhower",
    condition: (ctx, data) =>
      (data as { q1Count: number }).q1Count > 5,
    cooldown: "PT6H",
    priority: "high",
    channels: ["in_app"],
    messageTemplate: () => ({
      title: "Everything Can't Be Urgent",
      body: "You have 5+ tasks in the Do quadrant. That's a sign something needs to be reclassified. True emergencies are rare.",
      actionUrl: "/techniques/eisenhower",
      actionLabel: "Review Matrix",
    }),
  },
  {
    id: "eisenhower.weekly_review",
    event: "cron.weekly_review",
    methodology: "eisenhower",
    condition: () => true,
    cooldown: "P6D",
    priority: "medium",
    channels: ["email", "in_app"],
    messageTemplate: (ctx, data) => {
      const d = data as {
        q1Pct: number;
        q2Pct: number;
        q3Pct: number;
        q4Pct: number;
      };
      return {
        title: "Weekly Quadrant Review",
        body: `This week: ${d.q1Pct}% urgent+important, ${d.q2Pct}% important-not-urgent, ${d.q3Pct}% urgent-not-important, ${d.q4Pct}% neither. ${d.q2Pct > 40 ? "Excellent — you're investing in what matters." : "Try to spend more time in Q2 next week — that's where real progress lives."}`,
        actionUrl: "/analytics",
        actionLabel: "Full Report",
      };
    },
  },
];

/**
 * GTD (GETTING THINGS DONE)
 * Trigger Points: inbox pile-up, clarify reminder, weekly review,
 * context-aware suggestions, stale projects
 */
const GTD_TRIGGERS: CoachingTriggerDef[] = [
  {
    id: "gtd.capture_reminder",
    event: "cron.capture_time",
    methodology: "gtd",
    condition: () => true,
    cooldown: "PT8H",
    priority: "medium",
    channels: ["push", "in_app"],
    messageTemplate: () => ({
      title: "Brain Dump Time 🧠",
      body: "What's floating in your head right now? Get it out of your brain and into your inbox. 2 minutes.",
      actionUrl: "/techniques/gtd/inbox",
      actionLabel: "Open Inbox",
    }),
  },
  {
    id: "gtd.inbox_pileup",
    event: "cron.inbox_check",
    methodology: "gtd",
    condition: (ctx) => ctx.unprocessedInboxItems > 5,
    cooldown: "PT6H",
    priority: "high",
    channels: ["push", "in_app"],
    messageTemplate: (ctx) => ({
      title: "Inbox Needs Attention",
      body: `You have ${ctx.unprocessedInboxItems} unprocessed items. Your inbox is a collection point, not a storage unit. Let's clarify them.`,
      actionUrl: "/techniques/gtd/inbox",
      actionLabel: "Process Inbox",
    }),
  },
  {
    id: "gtd.weekly_review",
    event: "cron.weekly_review",
    methodology: "gtd",
    condition: () => true,
    cooldown: "P6D",
    priority: "critical",
    channels: ["push", "email", "in_app"],
    messageTemplate: () => ({
      title: "Weekly Review Time 📋",
      body: "The weekly review is the engine of GTD. Clear your inbox, review your projects, update your next actions. 30 minutes that save you hours.",
      actionUrl: "/techniques/gtd/review",
      actionLabel: "Start Review",
    }),
  },
  {
    id: "gtd.stale_project",
    event: "cron.daily_check",
    methodology: "gtd",
    condition: (ctx, data) =>
      (data as { staleProjectCount: number }).staleProjectCount > 0,
    cooldown: "P3D",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (ctx, data) => ({
      title: "Stale Projects Detected",
      body: `${(data as { staleProjectCount: number }).staleProjectCount} project(s) have no next action defined. A project without a next action is dead. Let's fix that.`,
      actionUrl: "/techniques/gtd/projects",
      actionLabel: "Review Projects",
    }),
  },
];

/**
 * TIME BLOCKING
 * Trigger Points: morning schedule, 5min before block, block start,
 * block overrun, unblocked gaps, daily adherence
 */
const TIME_BLOCKING_TRIGGERS: CoachingTriggerDef[] = [
  {
    id: "time_blocking.morning_schedule",
    event: "cron.morning_brief",
    methodology: "time_blocking",
    condition: () => true,
    cooldown: "PT20H",
    priority: "high",
    channels: ["push", "in_app"],
    messageTemplate: (ctx, data) => {
      const blockCount = (data as { todayBlockCount: number }).todayBlockCount;
      return {
        title: "Today's Schedule",
        body:
          blockCount > 0
            ? `You have ${blockCount} time blocks today. First block starts soon. Review your schedule and prepare.`
            : "No time blocks set for today. If it's not on your calendar, it doesn't get done. Block your priorities now.",
        actionUrl: "/techniques/time-blocking",
        actionLabel: blockCount > 0 ? "View Schedule" : "Create Blocks",
      };
    },
  },
  {
    id: "time_blocking.upcoming_block",
    event: "cron.block_upcoming",
    methodology: "time_blocking",
    condition: () => true,
    cooldown: "PT20M",
    priority: "high",
    channels: ["push", "in_app"],
    messageTemplate: (ctx, data) => ({
      title: "Block Starting in 5 Minutes",
      body: `Switching to: ${(data as { blockTitle: string }).blockTitle}. Wrap up what you're doing and prepare to transition.`,
      actionUrl: "/techniques/time-blocking",
      actionLabel: "View Block",
    }),
  },
  {
    id: "time_blocking.block_overrun",
    event: "time_block.overrun",
    methodology: "time_blocking",
    condition: (ctx, data) =>
      (data as { overrunMinutes: number }).overrunMinutes > 15,
    cooldown: "PT30M",
    priority: "high",
    channels: ["push", "in_app"],
    messageTemplate: (ctx, data) => ({
      title: "Block Overrun ⏰",
      body: `You're ${(data as { overrunMinutes: number }).overrunMinutes} minutes past your "${(data as { blockTitle: string }).blockTitle}" block. Move on or consciously extend? Lingering kills your schedule.`,
      actionUrl: "/techniques/time-blocking",
      actionLabel: "Adjust Schedule",
    }),
  },
  {
    id: "time_blocking.unblocked_gap",
    event: "cron.gap_detection",
    methodology: "time_blocking",
    condition: (ctx, data) =>
      (data as { gapMinutes: number }).gapMinutes >= 30,
    cooldown: "PT2H",
    priority: "low",
    channels: ["in_app"],
    messageTemplate: (ctx, data) => ({
      title: "Open Time Detected",
      body: `You have ${(data as { gapMinutes: number }).gapMinutes} unblocked minutes at ${(data as { gapStart: string }).gapStart}. Want to assign it to a task?`,
      actionUrl: "/techniques/time-blocking",
      actionLabel: "Fill Gap",
    }),
  },
];

/**
 * DEEP WORK
 * Trigger Points: session prep, distraction warnings, session end,
 * weekly deep work hours, scheduling recommendations
 */
const DEEP_WORK_TRIGGERS: CoachingTriggerDef[] = [
  {
    id: "deep_work.session_prep",
    event: "cron.deep_work_upcoming",
    methodology: "deep_work",
    condition: () => true,
    cooldown: "PT1H",
    priority: "high",
    channels: ["push", "in_app"],
    messageTemplate: () => ({
      title: "Deep Work in 10 Minutes 🧘",
      body: "Close Slack. Silence your phone. Clear your desk. Close unnecessary tabs. Your undivided attention is about to create something valuable.",
      actionUrl: "/techniques/deep-work",
      actionLabel: "Begin Session",
    }),
  },
  {
    id: "deep_work.distraction_spike",
    event: "deep_work.distraction_logged",
    methodology: "deep_work",
    condition: (ctx, data) =>
      (data as { distractionCount: number }).distractionCount >= 3,
    cooldown: "PT30M",
    priority: "high",
    channels: ["in_app"],
    messageTemplate: (ctx, data) => ({
      title: "Focus Drifting",
      body: `${(data as { distractionCount: number }).distractionCount} distractions so far. Each one costs you 23 minutes of recovery time. Recommit to the task. What's the ONE thing you need to finish?`,
    }),
  },
  {
    id: "deep_work.session_complete",
    event: "session.completed",
    methodology: "deep_work",
    condition: (ctx, data) =>
      (data as { sessionType: string }).sessionType === "deep_work",
    cooldown: "PT1M",
    priority: "high",
    channels: ["push", "in_app"],
    messageTemplate: (ctx, data) => {
      const mins = (data as { durationMinutes: number }).durationMinutes;
      const distractions = (data as { distractionCount: number })
        .distractionCount;
      return {
        title: "Deep Work Complete 💎",
        body: `${mins} minutes of deep work. ${distractions === 0 ? "Zero distractions — that's elite focus." : `${distractions} distraction${distractions === 1 ? "" : "s"} — awareness is the first step to fewer.`}`,
        actionUrl: "/techniques/deep-work",
        actionLabel: "Log Details",
      };
    },
  },
];

/**
 * EAT THE FROG
 * Trigger Points: morning frog assignment, frog avoidance detection,
 * frog completed celebration, noon warning
 */
const EAT_THE_FROG_TRIGGERS: CoachingTriggerDef[] = [
  {
    id: "eat_the_frog.morning",
    event: "cron.morning_brief",
    methodology: "eat_the_frog",
    condition: () => true,
    cooldown: "PT20H",
    priority: "critical",
    channels: ["push", "in_app"],
    messageTemplate: (ctx, data) => {
      const frogTitle = (data as { frogTitle: string | null }).frogTitle;
      return {
        title: "Good Morning. Here's Your Frog 🐸",
        body: frogTitle
          ? `Today's frog: "${frogTitle}". Eat it before anything else. The longer you wait, the heavier it gets.`
          : "You haven't set today's frog yet. What's the hardest, most important thing you need to do? That's your frog.",
        actionUrl: "/techniques/eat-the-frog",
        actionLabel: frogTitle ? "Start Frog" : "Set Frog",
      };
    },
  },
  {
    id: "eat_the_frog.avoidance",
    event: "task.started",
    methodology: "eat_the_frog",
    condition: (ctx, data) => {
      const isFrogTask = (data as { isFrog: boolean }).isFrog;
      return ctx.frogStatus === "set" && !isFrogTask;
    },
    cooldown: "PT1H",
    priority: "high",
    channels: ["in_app"],
    messageTemplate: () => ({
      title: "Frog Avoidance Detected 👀",
      body: "You're starting other tasks while your frog is still alive. Your brain is trying to feel productive without doing the hard thing. Stop. Eat the frog.",
      actionUrl: "/techniques/eat-the-frog",
      actionLabel: "Go to Frog",
    }),
  },
  {
    id: "eat_the_frog.completed",
    event: "task.completed",
    methodology: "eat_the_frog",
    condition: (ctx, data) => (data as { isFrog: boolean }).isFrog === true,
    cooldown: "PT1M",
    priority: "high",
    channels: ["push", "in_app"],
    messageTemplate: () => ({
      title: "Frog Eaten! 🎉🐸",
      body: "The hardest thing is done. Everything else today is downhill. This is how winners operate.",
      actionUrl: "/dashboard",
      actionLabel: "Continue Day",
    }),
  },
  {
    id: "eat_the_frog.noon_warning",
    event: "cron.noon_check",
    methodology: "eat_the_frog",
    condition: (ctx) => ctx.frogStatus === "set",
    cooldown: "PT20H",
    priority: "critical",
    channels: ["push", "in_app"],
    messageTemplate: () => ({
      title: "Your Frog Is Still Alive",
      body: "It's noon and you haven't started your frog. Block the next 45 minutes right now and eat it. No more excuses.",
      actionUrl: "/techniques/eat-the-frog",
      actionLabel: "Start Now",
    }),
  },
];

/**
 * TWO-MINUTE RULE
 * Trigger Points: new task flagged, inbox scan, deferred task warning
 */
const TWO_MINUTE_TRIGGERS: CoachingTriggerDef[] = [
  {
    id: "two_minute.task_flagged",
    event: "task.created",
    methodology: "two_minute",
    condition: (ctx, data) =>
      ((data as { estimatedMinutes: number }).estimatedMinutes ?? 999) <= 2,
    cooldown: "PT5M",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (ctx, data) => ({
      title: "Two-Minute Task Detected ⚡",
      body: `"${(data as { title: string }).title}" looks like a 2-minute task. Do it now instead of adding it to your list. The overhead of tracking it costs more than just doing it.`,
      actionUrl: "/techniques/two-minute",
      actionLabel: "Do It Now",
    }),
  },
  {
    id: "two_minute.batch_available",
    event: "cron.two_minute_scan",
    methodology: "two_minute",
    condition: (ctx, data) =>
      (data as { twoMinuteCount: number }).twoMinuteCount >= 3,
    cooldown: "PT4H",
    priority: "medium",
    channels: ["push", "in_app"],
    messageTemplate: (ctx, data) => ({
      title: "Quick Wins Available",
      body: `You have ${(data as { twoMinuteCount: number }).twoMinuteCount} tasks under 2 minutes. Knock them all out in one burst — should take about ${(data as { twoMinuteCount: number }).twoMinuteCount * 2} minutes.`,
      actionUrl: "/techniques/two-minute",
      actionLabel: "Clear Queue",
    }),
  },
  {
    id: "two_minute.deferred_warning",
    event: "task.deferred",
    methodology: "two_minute",
    condition: (ctx, data) =>
      (data as { isTwoMinute: boolean }).isTwoMinute &&
      (data as { deferCount: number }).deferCount >= 3,
    cooldown: "PT8H",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (ctx, data) => ({
      title: "Just Do It Already",
      body: `You've deferred "${(data as { title: string }).title}" ${(data as { deferCount: number }).deferCount} times. It takes 2 minutes. The mental overhead of seeing it repeatedly is costing you more. Do it now.`,
      actionUrl: "/techniques/two-minute",
      actionLabel: "Do It Now",
    }),
  },
];

/**
 * BATCH PROCESSING
 * Trigger Points: pattern detection, batch suggestion, batch session summary
 */
const BATCH_TRIGGERS: CoachingTriggerDef[] = [
  {
    id: "batch.pattern_detected",
    event: "task.created",
    methodology: "batch",
    condition: (ctx, data) =>
      (data as { sameCategoryCount: number }).sameCategoryCount >= 3,
    cooldown: "PT2H",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (ctx, data) => ({
      title: "Batch Opportunity 📦",
      body: `You have ${(data as { sameCategoryCount: number }).sameCategoryCount} ${(data as { category: string }).category} tasks. Batching them into one session could save you ${Math.round((data as { sameCategoryCount: number }).sameCategoryCount * 8)} minutes of context switching.`,
      actionUrl: "/techniques/batch",
      actionLabel: "Create Batch",
    }),
  },
  {
    id: "batch.session_complete",
    event: "session.completed",
    methodology: "batch",
    condition: (ctx, data) =>
      (data as { sessionType: string }).sessionType === "batch",
    cooldown: "PT1M",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: (ctx, data) => ({
      title: "Batch Complete ✅",
      body: `${(data as { tasksCompleted: number }).tasksCompleted} tasks knocked out in one session. That would've taken 2x longer spread across your day.`,
      actionUrl: "/techniques/batch",
      actionLabel: "View Summary",
    }),
  },
];

/**
 * PARETO (80/20 RULE)
 * Trigger Points: weekly analysis, low-impact time warning, monthly report
 */
const PARETO_TRIGGERS: CoachingTriggerDef[] = [
  {
    id: "pareto.weekly_analysis",
    event: "cron.friday_analysis",
    methodology: "pareto",
    condition: () => true,
    cooldown: "P6D",
    priority: "high",
    channels: ["push", "email", "in_app"],
    messageTemplate: (ctx, data) => ({
      title: "Your 80/20 Report 📊",
      body: `This week, ${(data as { topActivitiesCount: number }).topActivitiesCount} activities generated 80% of your results. ${(data as { bottomActivitiesCount: number }).bottomActivitiesCount} activities barely moved the needle. Time to double down on what works.`,
      actionUrl: "/techniques/pareto",
      actionLabel: "View Analysis",
    }),
  },
  {
    id: "pareto.low_impact_warning",
    event: "time_audit.activity_check",
    methodology: "pareto",
    condition: (ctx, data) =>
      (data as { lowImpactMinutes: number }).lowImpactMinutes > 180,
    cooldown: "PT6H",
    priority: "high",
    channels: ["in_app"],
    messageTemplate: (ctx, data) => ({
      title: "Low-Impact Alert",
      body: `You've spent ${Math.round((data as { lowImpactMinutes: number }).lowImpactMinutes / 60)} hours on low-impact tasks today. Is this the best use of your time? Check your high-impact activities.`,
      actionUrl: "/techniques/pareto",
      actionLabel: "Reprioritize",
    }),
  },
];

/**
 * TIME AUDIT
 * Trigger Points: end of day report, planned vs actual gap,
 * weekly trend alert, category drift
 */
const TIME_AUDIT_TRIGGERS: CoachingTriggerDef[] = [
  {
    id: "time_audit.daily_report",
    event: "cron.end_of_day",
    methodology: "time_audit",
    condition: () => true,
    cooldown: "PT20H",
    priority: "medium",
    channels: ["in_app", "push"],
    messageTemplate: (ctx, data) => ({
      title: "Where Your Time Went Today",
      body: `Planned: ${(data as { plannedHours: number }).plannedHours}h focused work. Actual: ${(data as { actualHours: number }).actualHours}h. ${(data as { actualHours: number }).actualHours >= (data as { plannedHours: number }).plannedHours ? "You hit your target. 🎯" : "Gap detected. Let's figure out what pulled you off course."}`,
      actionUrl: "/techniques/time-audit",
      actionLabel: "View Report",
    }),
  },
  {
    id: "time_audit.weekly_insight",
    event: "cron.weekly_review",
    methodology: "time_audit",
    condition: () => true,
    cooldown: "P6D",
    priority: "high",
    channels: ["email", "in_app"],
    messageTemplate: (ctx, data) => ({
      title: "Weekly Time Audit",
      body: `You think you spend ${(data as { perceivedDeepWork: number }).perceivedDeepWork}h on deep work. You actually spend ${(data as { actualDeepWork: number }).actualDeepWork}h. You can't manage what you don't measure.`,
      actionUrl: "/techniques/time-audit/reports",
      actionLabel: "Full Report",
    }),
  },
];

// ============================================================================
// 2. CROSS-METHODOLOGY INTELLIGENCE
// ============================================================================

const CROSS_METHODOLOGY_TRIGGERS: CoachingTriggerDef[] = [
  {
    id: "cross.methodology_unlock",
    event: "methodology.unlock_ready",
    methodology: "cross_methodology",
    condition: () => true,
    cooldown: "P1D",
    priority: "critical",
    channels: ["push", "email", "in_app"],
    messageTemplate: (ctx, data) => ({
      title: "New Technique Unlocked! 🔓",
      body: `You've mastered the basics of ${(data as { currentMethodology: string }).currentMethodology}. Ready for the next level? ${(data as { unlockedMethodology: string }).unlockedMethodology} is a natural next step and will amplify what you've already built.`,
      actionUrl: `/onboarding/${(data as { unlockedMethodologySlug: string }).unlockedMethodologySlug}`,
      actionLabel: "Explore",
    }),
  },
  {
    id: "cross.streak_at_risk",
    event: "cron.evening_check",
    methodology: "cross_methodology",
    condition: (ctx) =>
      ctx.streakCurrent >= 3 && ctx.todaysSessions === 0,
    cooldown: "PT20H",
    priority: "critical",
    channels: ["push", "in_app"],
    messageTemplate: (ctx) => ({
      title: `${ctx.streakCurrent}-Day Streak at Risk 🔥`,
      body: `You haven't logged a session today and your ${ctx.streakCurrent}-day streak is about to break. Even one Pomodoro or a 2-minute task burst keeps it alive.`,
      actionUrl: "/dashboard",
      actionLabel: "Quick Session",
    }),
  },
  {
    id: "cross.milestone_celebration",
    event: "analytics.milestone_reached",
    methodology: "cross_methodology",
    condition: () => true,
    cooldown: "PT1H",
    priority: "high",
    channels: ["push", "in_app"],
    messageTemplate: (ctx, data) => ({
      title: `Milestone! ${(data as { milestone: string }).milestone} 🏆`,
      body: (data as { description: string }).description,
      actionUrl: "/analytics",
      actionLabel: "View Progress",
    }),
  },
];

// ============================================================================
// 3. PROGRESSIVE UNLOCK CRITERIA
// ============================================================================

interface UnlockCriteria {
  methodology: MethodologyEnum;
  requirements: {
    minDaysActive: number;
    minSessions: number;
    minMasteryScore: number; // 0-100
    additionalConditions?: string[];
  };
}

const UNLOCK_CRITERIA: Record<MethodologyEnum, UnlockCriteria["requirements"]> =
  {
    pomodoro: {
      minDaysActive: 7,
      minSessions: 20,
      minMasteryScore: 30,
      additionalConditions: ["Completed at least one full set of 4 cycles"],
    },
    gtd: {
      minDaysActive: 7,
      minSessions: 5,
      minMasteryScore: 25,
      additionalConditions: [
        "Completed at least one Weekly Review",
        "Processed inbox to zero at least once",
      ],
    },
    eisenhower: {
      minDaysActive: 7,
      minSessions: 10,
      minMasteryScore: 30,
      additionalConditions: [
        "Categorized at least 20 tasks across all quadrants",
      ],
    },
    time_blocking: {
      minDaysActive: 7,
      minSessions: 7,
      minMasteryScore: 25,
      additionalConditions: [
        "Created time blocks for at least 5 days",
        "Average block adherence >= 60%",
      ],
    },
    pareto: {
      minDaysActive: 14,
      minSessions: 10,
      minMasteryScore: 35,
      additionalConditions: [
        "Completed at least two weekly 80/20 analyses",
        "Tagged at least 15 tasks with impact scores",
      ],
    },
    deep_work: {
      minDaysActive: 7,
      minSessions: 5,
      minMasteryScore: 30,
      additionalConditions: [
        "Completed at least one 90-minute deep work session",
        "Average distraction count < 5 per session",
      ],
    },
    eat_the_frog: {
      minDaysActive: 7,
      minSessions: 7,
      minMasteryScore: 30,
      additionalConditions: [
        "Eaten the frog before noon at least 5 times",
      ],
    },
    two_minute: {
      minDaysActive: 5,
      minSessions: 10,
      minMasteryScore: 25,
      additionalConditions: [
        "Cleared at least 20 two-minute tasks",
      ],
    },
    batch: {
      minDaysActive: 7,
      minSessions: 5,
      minMasteryScore: 25,
      additionalConditions: [
        "Completed at least 3 batch sessions",
        "Batched tasks from at least 3 different categories",
      ],
    },
    time_audit: {
      minDaysActive: 14,
      minSessions: 14,
      minMasteryScore: 30,
      additionalConditions: [
        "Tracked time for at least 10 complete days",
        "Reviewed at least 2 weekly time audit reports",
      ],
    },
  };

// ============================================================================
// 4. AI PROMPT TEMPLATES
// ============================================================================

/**
 * System prompt for the AI coaching chat.
 * Dynamically constructed based on user context.
 */
function buildCoachingSystemPrompt(ctx: UserContext): string {
  return `You are FlowState Coach, an expert productivity coach integrated into the FlowState Pro platform.

## Your Role
You are a direct, results-oriented productivity coach. You don't coddle — you challenge, support, and hold accountable. Think: the coach who makes you better, not the one who tells you what you want to hear.

## Communication Style: ${ctx.coachingTone}
${ctx.coachingTone === "encouraging" ? "Lead with positivity but don't shy from honest feedback. Celebrate wins, frame challenges as opportunities." : ""}
${ctx.coachingTone === "direct" ? "Cut to the chase. No fluff. Give actionable advice in minimal words. Challenge excuses immediately." : ""}
${ctx.coachingTone === "analytical" ? "Lead with data and patterns. Reference specific metrics. Frame advice in terms of optimization and efficiency." : ""}
${ctx.coachingTone === "motivational" ? "High energy. Reference progress, streaks, and achievements. Frame everything as building toward mastery." : ""}

## User Context
- Active methodology: ${ctx.activeMethodology || "none selected"}
- Current streak: ${ctx.streakCurrent} days
- Today's sessions: ${ctx.todaysSessions}
- Today's focus time: ${ctx.todaysFocusMinutes} minutes
- Pending tasks: ${ctx.pendingTasks}
- Frog status: ${ctx.frogStatus}
- Unprocessed inbox items: ${ctx.unprocessedInboxItems}

## Rules
1. Always be specific. Don't say "try to focus more" — say "start a 25-minute Pomodoro on your highest-priority task right now."
2. Reference the user's actual data when possible.
3. Keep responses concise — under 150 words unless the user asks for detailed analysis.
4. If the user is struggling, acknowledge it briefly then redirect to action.
5. Never be passive. Every response should end with a clear next step or action.
6. If the user asks about a methodology they haven't unlocked yet, explain the unlock criteria and encourage them.
7. Cross-reference methodologies when it would help: "Your Time Audit shows you're most focused at 9am — that's when you should schedule your frog."`;
}

/**
 * Daily briefing prompt template.
 * Fed with aggregated user data to generate personalized morning brief.
 */
function buildDailyBriefingPrompt(methodology: MethodologyEnum | null): string {
  return `Generate a personalized morning briefing for a FlowState Pro user.

## Format
- Greeting (1 line)
- Yesterday's highlight (1 line — celebrate something specific)
- Today's priority (2-3 lines — what to focus on based on their active methodology)
- Actionable first step (1 line — specific, immediate action)

## Methodology Focus: ${methodology || "general productivity"}
${methodology === "pomodoro" ? "Frame the day in terms of Pomodoro cycles they should target." : ""}
${methodology === "eisenhower" ? "Highlight which quadrant deserves the most attention today." : ""}
${methodology === "gtd" ? "Check inbox status and suggest next actions to prioritize." : ""}
${methodology === "time_blocking" ? "Preview their scheduled blocks and identify key transitions." : ""}
${methodology === "deep_work" ? "Identify the best window for deep work based on their patterns." : ""}
${methodology === "eat_the_frog" ? "Surface their frog task and create urgency around it." : ""}
${methodology === "pareto" ? "Highlight their highest-impact activities for the day." : ""}
${methodology === "two_minute" ? "Note any quick wins that can be cleared immediately." : ""}
${methodology === "batch" ? "Suggest batch groupings for today's similar tasks." : ""}
${methodology === "time_audit" ? "Compare yesterday's planned vs actual and set today's tracking focus." : ""}

## Rules
- Keep total under 100 words.
- Be specific — reference actual tasks, times, and metrics from the data provided.
- End with ONE clear action the user should take in the next 5 minutes.
- No generic advice. Every word should be personalized.`;
}

// ============================================================================
// 5. NOTIFICATION DELIVERY STRATEGY
// ============================================================================

interface DeliveryStrategy {
  /** Max notifications per hour per user */
  maxPerHour: Record<"aggressive" | "moderate" | "minimal", number>;
  /** Max notifications per day per user */
  maxPerDay: Record<"aggressive" | "moderate" | "minimal", number>;
  /** Channel priority order based on message priority */
  channelPriority: Record<CoachingPriority, CoachingChannel[]>;
  /** Quiet hours enforcement */
  quietHoursExceptions: CoachingPriority[]; // Which priorities bypass quiet hours
}

const DELIVERY_STRATEGY: DeliveryStrategy = {
  maxPerHour: {
    aggressive: 6,
    moderate: 3,
    minimal: 1,
  },
  maxPerDay: {
    aggressive: 30,
    moderate: 15,
    minimal: 5,
  },
  channelPriority: {
    low: ["in_app"],
    medium: ["in_app", "push"],
    high: ["push", "in_app"],
    critical: ["push", "in_app", "email"],
  },
  quietHoursExceptions: ["critical"], // Only critical messages bypass quiet hours
};

// ============================================================================
// EXPORTS
// ============================================================================

export {
  POMODORO_TRIGGERS,
  EISENHOWER_TRIGGERS,
  GTD_TRIGGERS,
  TIME_BLOCKING_TRIGGERS,
  DEEP_WORK_TRIGGERS,
  EAT_THE_FROG_TRIGGERS,
  TWO_MINUTE_TRIGGERS,
  BATCH_TRIGGERS,
  PARETO_TRIGGERS,
  TIME_AUDIT_TRIGGERS,
  CROSS_METHODOLOGY_TRIGGERS,
  UNLOCK_CRITERIA,
  DELIVERY_STRATEGY,
  buildCoachingSystemPrompt,
  buildDailyBriefingPrompt,
};

export type {
  CoachingTriggerDef,
  UserContext,
  CoachingChannel,
  CoachingPriority,
  CoachingTone,
  DeliveryStrategy,
  UnlockCriteria,
};
