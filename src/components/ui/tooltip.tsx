"use client";

import {
  type ReactNode,
  useState,
  useRef,
  useCallback,
  type HTMLAttributes,
} from "react";
import { cn } from "@/lib/utils/cn";

interface TooltipProps {
  content: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  children: ReactNode;
  delayMs?: number;
}

export function Tooltip({
  content,
  side = "top",
  children,
  delayMs = 200,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const show = useCallback(() => {
    timeoutRef.current = setTimeout(() => setVisible(true), delayMs);
  }, [delayMs]);

  const hide = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  }, []);

  const positionClasses: Record<string, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          className={cn(
            "pointer-events-none absolute z-[var(--z-tooltip)] whitespace-nowrap rounded-[var(--radius-md)] bg-[var(--text-primary)] px-2.5 py-1.5 text-xs font-medium text-[var(--text-inverse)] shadow-[var(--shadow-md)]",
            positionClasses[side]
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}

export function TooltipProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
