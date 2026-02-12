export interface DailyAnalytics {
  id: string;
  userId: string;
  date: string;
  totalFocusMinutes: number;
  totalBreakMinutes: number;
  sessionsCompleted: number;
  tasksCompleted: number;
  pomodorosCompleted: number;
  deepWorkMinutes: number;
  distractionCount: number;
  currentStreak: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WeeklyAnalytics {
  id: string;
  userId: string;
  weekStart: string;
  totalFocusMinutes: number;
  totalSessions: number;
  totalTasks: number;
  avgDailyFocusMinutes: number;
  bestDay: string | null;
  bestDayMinutes: number;
  paretoAnalysis: Record<string, unknown> | null;
  timeAudit: Record<string, unknown> | null;
  methodologyBreakdown: Record<string, unknown> | null;
  coachingInsights: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductivityHeatmapEntry {
  date: string;
  focusMinutes: number;
  sessions: number;
}

export interface TimeDistributionEntry {
  category: string;
  minutes: number;
  percentage: number;
  color: string;
}

export interface StreakData {
  current: number;
  longest: number;
  lastActiveDate: string;
  history: { date: string; active: boolean }[];
}
