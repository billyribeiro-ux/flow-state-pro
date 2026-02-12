"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function EisenhowerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Eisenhower error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">
        Matrix Error
      </h2>
      <p className="max-w-md text-sm text-[var(--text-secondary)]">
        Something went wrong loading the Eisenhower Matrix.
      </p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
