import type { CoachingTriggerDef } from "../types";

export const POMODORO_TRIGGERS: CoachingTriggerDef[] = [
  {
    id: "pomodoro.focus.starting",
    event: "session.started",
    methodology: "pomodoro",
    condition: (_ctx, data) =>
      (data as { sessionType: string }).sessionType === "focus",
    cooldown: "PT25M",
    priority: "medium",
    channels: ["push", "in_app"],
    messageTemplate: () => ({
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
    condition: (_ctx, data) =>
      (data as { sessionType: string }).sessionType === "focus",
    cooldown: "PT1M",
    priority: "high",
    channels: ["push", "in_app"],
    messageTemplate: (_ctx, data) => {
      const cycle = (data as { pomodoroCycle: number }).pomodoroCycle;
      const isLongBreak = cycle % 4 === 0;
      return {
        title: isLongBreak ? "Long Break Earned! 🏆" : "Break Time",
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
    condition: (_ctx, data) =>
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
