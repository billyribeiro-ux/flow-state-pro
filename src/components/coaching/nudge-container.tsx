"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { NudgeToast } from "./nudge-toast";
import type { CoachingNudge } from "@/types/coaching";

export function NudgeContainer() {
  const router = useRouter();
  const [nudges, setNudges] = useState<CoachingNudge[]>([]);

  const handleDismiss = useCallback((id: string) => {
    setNudges((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const handleAction = useCallback(
    (id: string, url: string) => {
      setNudges((prev) => prev.filter((n) => n.id !== id));
      router.push(url);
    },
    [router]
  );

  if (nudges.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[var(--z-toast)] flex flex-col gap-2">
      {nudges.map((nudge) => (
        <NudgeToast
          key={nudge.id}
          nudge={nudge}
          onDismiss={handleDismiss}
          onAction={handleAction}
        />
      ))}
    </div>
  );
}
