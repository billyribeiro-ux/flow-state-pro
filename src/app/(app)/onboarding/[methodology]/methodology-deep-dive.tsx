"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Timer,
  GridFour,
  CalendarBlank,
  Lightning,
  Tray,
  ChartBar,
  Brain,
  FishSimple,
  Stack,
  MagnifyingGlass,
  ArrowRight,
  Play,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { MethodologyDef } from "@/lib/constants/methodologies";
import { completeOnboardingAction } from "../actions";

const ICON_MAP: Record<string, React.ElementType> = {
  Timer,
  GridFour,
  CalendarBlank,
  Lightning,
  Tray,
  ChartBar,
  Brain,
  FishSimple,
  Stack,
  MagnifyingGlass,
};

interface MethodologyDeepDiveProps {
  methodology: MethodologyDef;
}

export function MethodologyDeepDive({ methodology }: MethodologyDeepDiveProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const Icon = ICON_MAP[methodology.icon] ?? Timer;

  const handleStart = async () => {
    setIsPending(true);
    try {
      await completeOnboardingAction();
      router.push("/dashboard");
    } catch {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="space-y-4 text-center">
        <div
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-[var(--radius-2xl)]"
          style={{ backgroundColor: `${methodology.color}15` }}
        >
          <Icon
            size={40}
            weight="duotone"
            style={{ color: methodology.color }}
          />
        </div>
        <div>
          <Badge variant="outline" className="mb-3">
            {methodology.category}
          </Badge>
          <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">
            {methodology.name}
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
            {methodology.description}
          </p>
        </div>
      </div>

      {/* Video placeholder */}
      <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-tertiary)] shadow-[var(--shadow-md)]">
        <div className="flex aspect-video items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-center">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full text-white"
              style={{ backgroundColor: methodology.color }}
            >
              <Play size={28} weight="fill" />
            </div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              Video coming soon
            </p>
            <p className="max-w-xs text-xs text-[var(--text-tertiary)]">
              Connect your Mux account to enable methodology explainer videos
            </p>
          </div>
        </div>
      </div>

      {/* Core Mechanic */}
      <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6 shadow-[var(--shadow-xs)]">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          How It Works
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
          {methodology.coreMechanic}
        </p>
        <div className="mt-4 rounded-[var(--radius-lg)] bg-[var(--surface-secondary)] p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
            What you&apos;ll build
          </p>
          <ul className="mt-2 space-y-2 text-sm text-[var(--text-secondary)]">
            <li className="flex items-start gap-2">
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: methodology.color }}
              />
              A consistent daily practice with this technique
            </li>
            <li className="flex items-start gap-2">
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: methodology.color }}
              />
              Data-driven insights about your productivity patterns
            </li>
            <li className="flex items-start gap-2">
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: methodology.color }}
              />
              AI coaching tailored to your progress
            </li>
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-center">
        <Button
          size="lg"
          disabled={isPending}
          onClick={handleStart}
          className="min-w-[240px] gap-2"
        >
          {isPending ? (
            "Setting up your workspace..."
          ) : (
            <>
              Start with {methodology.name}
              <ArrowRight size={18} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
