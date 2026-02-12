"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function PomodoroError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Pomodoro error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">
        Timer Error
      </h2>
      <p className="max-w-md text-sm text-[var(--text-secondary)]">
        Something went wrong with the Pomodoro timer. Your session data is safe.
      </p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
