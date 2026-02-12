"use client";

import { useState } from "react";
import { FishSimple, CheckCircle, Plus, Target, Trophy } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface FrogTask {
  id: string;
  title: string;
  completed: boolean;
  date: string;
}

export function EatTheFrogWorkspace() {
  const [todayFrog, setTodayFrog] = useState<FrogTask | null>(null);
  const [pastFrogs, setPastFrogs] = useState<FrogTask[]>([]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Eat The Frog</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Tackle your most important (and most dreaded) task first thing every day.
        </p>
      </div>

      {/* Today's Frog */}
      <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Today&apos;s Frog</h2>
            <p className="text-xs text-[var(--text-tertiary)]">{today}</p>
          </div>
          <FishSimple size={32} weight="duotone" className="text-[var(--methodology-eat-the-frog)]" />
        </div>

        {todayFrog ? (
          <div className="flex flex-col items-center gap-4">
            <div className={`flex w-full items-center gap-4 rounded-[var(--radius-lg)] border-2 p-4 ${
              todayFrog.completed
                ? "border-[var(--color-success)] bg-[var(--color-success)]/5"
                : "border-[var(--methodology-eat-the-frog)] bg-[var(--methodology-eat-the-frog)]/5"
            }`}>
              {todayFrog.completed ? (
                <CheckCircle size={28} weight="fill" className="shrink-0 text-[var(--color-success)]" />
              ) : (
                <Target size={28} weight="duotone" className="shrink-0 text-[var(--methodology-eat-the-frog)]" />
              )}
              <div className="min-w-0 flex-1">
                <p className={`text-lg font-semibold ${
                  todayFrog.completed ? "text-[var(--color-success)] line-through" : "text-[var(--text-primary)]"
                }`}>
                  {todayFrog.title}
                </p>
              </div>
            </div>
            {!todayFrog.completed && (
              <Button
                onClick={() => setTodayFrog({ ...todayFrog, completed: true })}
                className="bg-[var(--methodology-eat-the-frog)] hover:bg-[var(--methodology-eat-the-frog)]/90"
              >
                <CheckCircle size={18} className="mr-2" />
                Mark Frog as Eaten
              </Button>
            )}
            {todayFrog.completed && (
              <div className="flex items-center gap-2 text-[var(--color-success)]">
                <Trophy size={20} weight="fill" />
                <p className="text-sm font-medium">Frog eaten! The hardest part of your day is done.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <FishSimple size={56} weight="duotone" className="text-[var(--text-tertiary)]" />
            <div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                No frog set for today
              </p>
              <p className="mt-1 text-xs text-[var(--text-tertiary)]">
                Pick the ONE task you&apos;re most likely to procrastinate on
              </p>
            </div>
            <Button>
              <Plus size={14} className="mr-1.5" />
              Set Today&apos;s Frog
            </Button>
          </div>
        )}
      </div>

      {/* Frog History */}
      <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Frog History</h3>
        {pastFrogs.length === 0 ? (
          <p className="mt-4 text-center text-sm text-[var(--text-tertiary)]">
            Your eaten frogs will appear here
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {pastFrogs.map((frog) => (
              <div key={frog.id} className="flex items-center gap-3 rounded-[var(--radius-md)] p-2">
                <CheckCircle
                  size={16}
                  weight={frog.completed ? "fill" : "regular"}
                  className={frog.completed ? "text-[var(--color-success)]" : "text-[var(--text-tertiary)]"}
                />
                <span className={`flex-1 text-sm ${frog.completed ? "text-[var(--text-secondary)] line-through" : "text-[var(--text-primary)]"}`}>
                  {frog.title}
                </span>
                <span className="text-xs text-[var(--text-tertiary)]">{frog.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
