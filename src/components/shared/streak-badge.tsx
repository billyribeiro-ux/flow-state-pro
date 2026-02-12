"use client";

import { Fire } from "@phosphor-icons/react";

interface StreakBadgeProps {
  count: number;
  size?: "sm" | "md" | "lg";
}

export function StreakBadge({ count, size = "md" }: StreakBadgeProps) {
  if (count <= 0) return null;

  const sizeClasses = {
    sm: "gap-1 px-2 py-0.5 text-[10px]",
    md: "gap-1.5 px-2.5 py-1 text-xs",
    lg: "gap-2 px-3 py-1.5 text-sm",
  };

  const iconSizes = { sm: 10, md: 12, lg: 16 };

  const isHot = count >= 7;
  const isOnFire = count >= 30;

  return (
    <div
      className={`inline-flex items-center rounded-full font-bold ${sizeClasses[size]} ${
        isOnFire
          ? "bg-[var(--color-error)] text-white"
          : isHot
            ? "bg-[var(--color-warning)] text-white"
            : "bg-[var(--color-warning)]/10 text-[var(--color-warning)]"
      }`}
    >
      <Fire size={iconSizes[size]} weight={isHot ? "fill" : "duotone"} />
      {count}
    </div>
  );
}
