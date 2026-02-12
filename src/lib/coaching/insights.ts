import type { DailyAnalytics, WeeklyAnalytics } from "@/types/analytics";

export interface Insight {
  id: string;
  type: "positive" | "improvement" | "milestone" | "warning" | "suggestion";
  title: string;
  body: string;
  methodology?: string;
  metric?: string;
  value?: number;
  previousValue?: number;
  changePercent?: number;
}

export function generateDailyInsights(
  today: DailyAnalytics,
  yesterday?: DailyAnalytics | null
): Insight[] {
  const insights: Insight[] = [];

  // Focus time comparison
  if (yesterday && today.totalFocusMinutes > 0) {
    const change = today.totalFocusMinutes - yesterday.totalFocusMinutes;
    const pct = yesterday.totalFocusMinutes > 0
      ? Math.round((change / yesterday.totalFocusMinutes) * 100)
      : 100;

    if (pct > 20) {
      insights.push({
        id: "focus-increase",
        type: "positive",
        title: "Focus time up!",
        body: `You focused ${pct}% more than yesterday. Keep this momentum going.`,
        metric: "focusMinutes",
        value: today.totalFocusMinutes,
        previousValue: yesterday.totalFocusMinutes,
        changePercent: pct,
      });
    } else if (pct < -30) {
      insights.push({
        id: "focus-decrease",
        type: "improvement",
        title: "Focus dip detected",
        body: `Your focus time dropped ${Math.abs(pct)}% from yesterday. Consider scheduling a deep work block.`,
        metric: "focusMinutes",
        value: today.totalFocusMinutes,
        previousValue: yesterday.totalFocusMinutes,
        changePercent: pct,
      });
    }
  }

  // Streak milestones
  if (today.currentStreak > 0 && today.currentStreak % 7 === 0) {
    insights.push({
      id: `streak-milestone-${today.currentStreak}`,
      type: "milestone",
      title: `${today.currentStreak}-day streak!`,
      body: `You've been consistent for ${today.currentStreak} days straight. That's building real habits.`,
      metric: "streak",
      value: today.currentStreak,
    });
  }

  // Session count
  if (today.sessionsCompleted >= 5) {
    insights.push({
      id: "high-session-count",
      type: "positive",
      title: "Productive day",
      body: `${today.sessionsCompleted} sessions completed — you're in the zone today.`,
      metric: "sessions",
      value: today.sessionsCompleted,
    });
  }

  // Distraction awareness
  if (today.distractionCount > 5) {
    insights.push({
      id: "high-distractions",
      type: "warning",
      title: "Distraction alert",
      body: `${today.distractionCount} distractions logged today. Try closing unnecessary tabs and silencing notifications.`,
      metric: "distractions",
      value: today.distractionCount,
    });
  }

  return insights;
}

export function generateWeeklyInsights(
  current: WeeklyAnalytics,
  previous?: WeeklyAnalytics | null
): Insight[] {
  const insights: Insight[] = [];

  if (previous) {
    const focusChange = current.totalFocusMinutes - previous.totalFocusMinutes;
    const pct = previous.totalFocusMinutes > 0
      ? Math.round((focusChange / previous.totalFocusMinutes) * 100)
      : 0;

    if (pct > 10) {
      insights.push({
        id: "weekly-focus-up",
        type: "positive",
        title: "Weekly focus improved",
        body: `${pct}% more focus time than last week. Your consistency is paying off.`,
        changePercent: pct,
      });
    }
  }

  // Focus hours milestone
  const focusHours = Math.round(current.totalFocusMinutes / 60);
  if (focusHours >= 20) {
    insights.push({
      id: "weekly-20h",
      type: "milestone",
      title: `${focusHours}h focused this week`,
      body: "That's deep work territory. You're operating at a high level.",
      value: focusHours,
    });
  }

  return insights;
}
