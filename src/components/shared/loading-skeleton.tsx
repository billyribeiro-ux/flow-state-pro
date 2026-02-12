"use client";

interface LoadingSkeletonProps {
  lines?: number;
  className?: string;
  variant?: "text" | "card" | "avatar" | "chart";
}

export function LoadingSkeleton({
  lines = 3,
  className = "",
  variant = "text",
}: LoadingSkeletonProps) {
  if (variant === "avatar") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--surface-secondary)]" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-2/3 animate-pulse rounded bg-[var(--surface-secondary)]" />
          <div className="h-2.5 w-1/3 animate-pulse rounded bg-[var(--surface-secondary)]" />
        </div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div
        className={`animate-pulse rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6 ${className}`}
      >
        <div className="mb-4 h-4 w-1/3 rounded bg-[var(--surface-secondary)]" />
        <div className="space-y-3">
          <div className="h-3 w-full rounded bg-[var(--surface-secondary)]" />
          <div className="h-3 w-4/5 rounded bg-[var(--surface-secondary)]" />
          <div className="h-3 w-2/3 rounded bg-[var(--surface-secondary)]" />
        </div>
      </div>
    );
  }

  if (variant === "chart") {
    return (
      <div
        className={`animate-pulse rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6 ${className}`}
      >
        <div className="mb-4 h-4 w-1/4 rounded bg-[var(--surface-secondary)]" />
        <div className="h-40 w-full rounded-[var(--radius-md)] bg-[var(--surface-secondary)]" />
      </div>
    );
  }

  // text variant
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 animate-pulse rounded bg-[var(--surface-secondary)]"
          style={{ width: `${100 - i * 15}%` }}
        />
      ))}
    </div>
  );
}
