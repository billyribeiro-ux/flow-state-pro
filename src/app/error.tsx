"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root error boundary:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-[family-name:var(--font-syne)] text-4xl font-bold text-[var(--text-primary)]">
        Something went wrong
      </h1>
      <p className="max-w-md text-[var(--text-secondary)]">
        An unexpected error occurred. Our team has been notified.
      </p>
      <button
        onClick={reset}
        className="mt-4 rounded-[var(--radius-lg)] bg-[var(--color-brand-600)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-brand-700)]"
      >
        Try Again
      </button>
    </div>
  );
}
