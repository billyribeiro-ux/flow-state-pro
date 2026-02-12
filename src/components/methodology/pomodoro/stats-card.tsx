import { Badge } from "@/components/ui/badge";

interface StatsCardProps {
  pomodoroCycle: number;
  pomodoroSet: number;
  cyclesBeforeLongBreak: number;
  todaySessions: number;
  todayFocusMinutes: number;
}

export function StatsCard({
  pomodoroCycle,
  pomodoroSet,
  cyclesBeforeLongBreak,
  todaySessions,
  todayFocusMinutes,
}: StatsCardProps) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-4 shadow-[var(--shadow-xs)]">
      <h3 className="text-sm font-semibold text-[var(--text-primary)]">
        Session Stats
      </h3>

      <div className="mt-3 space-y-3">
        {/* Cycle indicator */}
        <div>
          <p className="text-xs text-[var(--text-tertiary)]">Current Cycle</p>
          <div className="mt-1 flex items-center gap-1.5">
            {Array.from({ length: cyclesBeforeLongBreak }).map((_, i) => (
              <div
                key={i}
                className={`h-2.5 flex-1 rounded-full transition-colors ${
                  i < pomodoroCycle
                    ? "bg-[var(--color-pomodoro)]"
                    : "bg-[var(--surface-tertiary)]"
                }`}
              />
            ))}
            <Badge variant="secondary" className="ml-2 text-[10px]">
              Set {pomodoroSet}
            </Badge>
          </div>
        </div>

        {/* Today's stats */}
        <div className="grid grid-cols-2 gap-3 border-t border-[var(--border-subtle)] pt-3">
          <div>
            <p className="text-xs text-[var(--text-tertiary)]">Today</p>
            <p className="text-lg font-bold text-[var(--color-pomodoro)]">
              {todaySessions}
            </p>
            <p className="text-[10px] text-[var(--text-tertiary)]">sessions</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-tertiary)]">Focus Time</p>
            <p className="text-lg font-bold text-[var(--text-primary)]">
              {todayFocusMinutes}m
            </p>
            <p className="text-[10px] text-[var(--text-tertiary)]">minutes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
