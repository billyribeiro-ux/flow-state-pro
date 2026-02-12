import type { CoachingTriggerDef } from "../types";

export const EAT_THE_FROG_TRIGGERS: CoachingTriggerDef[] = [
  {
    id: "eat_the_frog.morning",
    event: "cron.morning_brief",
    methodology: "eat_the_frog",
    condition: () => true,
    cooldown: "PT20H",
    priority: "critical",
    channels: ["push", "in_app"],
    messageTemplate: (_ctx, data) => {
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
    condition: (_ctx, data) => (data as { isFrog: boolean }).isFrog === true,
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
  {
    id: "eat_the_frog.afternoon_warning",
    event: "cron.afternoon_check",
    methodology: "eat_the_frog",
    condition: (ctx) => ctx.frogStatus === "set",
    cooldown: "PT20H",
    priority: "high",
    channels: ["push", "in_app"],
    messageTemplate: () => ({
      title: "Frog Alert: Day Almost Over",
      body: "It's afternoon and your frog is still alive. You have a few hours left. Start now or it rolls to tomorrow — and tomorrow's frog will be even heavier.",
      actionUrl: "/techniques/eat-the-frog",
      actionLabel: "Start Now",
    }),
  },
  {
    id: "eat_the_frog.in_progress",
    event: "task.started",
    methodology: "eat_the_frog",
    condition: (_ctx, data) => (data as { isFrog: boolean }).isFrog === true,
    cooldown: "PT1M",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: () => ({
      title: "Eating the Frog 🐸💪",
      body: "You're doing it. The hardest part is starting. Stay locked in — don't switch tasks until this is done.",
      actionUrl: "/techniques/eat-the-frog",
      actionLabel: "Stay Focused",
    }),
  },
  {
    id: "eat_the_frog.streak",
    event: "task.completed",
    methodology: "eat_the_frog",
    condition: (_ctx, data) =>
      (data as { isFrog: boolean }).isFrog &&
      (data as { consecutiveFrogDays: number }).consecutiveFrogDays >= 3,
    cooldown: "PT1M",
    priority: "high",
    channels: ["push", "in_app"],
    messageTemplate: (_ctx, data) => ({
      title: `${(data as { consecutiveFrogDays: number }).consecutiveFrogDays}-Day Frog Streak! 🐸🔥`,
      body: `You've eaten your frog ${(data as { consecutiveFrogDays: number }).consecutiveFrogDays} days in a row. That's discipline compounding. Keep it alive tomorrow.`,
      actionUrl: "/techniques/eat-the-frog",
      actionLabel: "View Streak",
    }),
  },
  {
    id: "eat_the_frog.end_of_day_missed",
    event: "cron.end_of_day",
    methodology: "eat_the_frog",
    condition: (ctx) => ctx.frogStatus === "set",
    cooldown: "PT20H",
    priority: "medium",
    channels: ["in_app"],
    messageTemplate: () => ({
      title: "Frog Survived Today",
      body: "Your frog made it through the day uneaten. No judgment — but notice how it feels. Tomorrow, eat it first. Before email. Before anything comfortable.",
      actionUrl: "/techniques/eat-the-frog",
      actionLabel: "Set Tomorrow's Frog",
    }),
  },
  {
    id: "eat_the_frog.before_9am",
    event: "task.completed",
    methodology: "eat_the_frog",
    condition: (_ctx, data) =>
      (data as { isFrog: boolean }).isFrog &&
      (data as { completedHour: number }).completedHour < 9,
    cooldown: "PT1M",
    priority: "high",
    channels: ["push", "in_app"],
    messageTemplate: () => ({
      title: "Frog Before 9am! 🐸⚡",
      body: "You ate your frog before most people finish their coffee. The rest of your day is pure bonus. This is elite-level discipline.",
      actionUrl: "/dashboard",
      actionLabel: "Ride the Momentum",
    }),
  },
];
