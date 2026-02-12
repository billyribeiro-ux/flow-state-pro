"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { MethodologyCard } from "./methodology-card";
import { Button } from "@/components/ui/button";
import {
  METHODOLOGIES,
  METHODOLOGY_IDS,
  PHASE_1_METHODOLOGIES,
  type MethodologyId,
} from "@/lib/constants/methodologies";
import { selectMethodologyAction } from "@/app/(app)/onboarding/actions";

export function MethodologyGrid() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [selected, setSelected] = useState<MethodologyId | null>(null);
  const [isPending, setIsPending] = useState(false);

  // GSAP stagger animation on mount
  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean);
    if (cards.length === 0) return;

    gsap.set(cards, { opacity: 0, y: 30 });
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
      delay: 0.2,
    });
  }, []);

  const handleSelect = useCallback((id: string) => {
    setSelected(id as MethodologyId);
  }, []);

  const handleContinue = async () => {
    if (!selected) return;
    setIsPending(true);
    try {
      await selectMethodologyAction(selected);
      router.push(`/onboarding/${METHODOLOGIES[selected].slug}`);
    } catch {
      setIsPending(false);
    }
  };

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">
          Choose Your First Technique
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
          Start with one methodology. Master it. Then unlock complementary
          techniques that amplify your productivity system.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {METHODOLOGY_IDS.map((id, index) => {
          const methodology = METHODOLOGIES[id];
          const isPhase1 = PHASE_1_METHODOLOGIES.includes(id);
          return (
            <MethodologyCard
              key={id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              methodology={methodology}
              selected={selected === id}
              locked={!isPhase1}
              onSelect={handleSelect}
            />
          );
        })}
      </div>

      {/* Continue button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          disabled={!selected || isPending}
          onClick={handleContinue}
          className="min-w-[200px]"
        >
          {isPending ? "Setting up..." : "Continue"}
        </Button>
      </div>
    </div>
  );
}
