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
];
