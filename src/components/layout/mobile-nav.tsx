"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Timer,
  GridFour,
  CalendarBlank,
  Lightning,
  House,
  ChartBar,
  Gear,
  Robot,
  X,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils/cn";
import { useUIStore } from "@/lib/stores/ui-store";
import { ROUTES } from "@/lib/constants/routes";

interface MobileNavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  color?: string;
}

const ALL_NAV: MobileNavItem[] = [
  { label: "Dashboard", href: ROUTES.dashboard, icon: House },
  {
    label: "Pomodoro",
    href: ROUTES.techniques.pomodoro,
    icon: Timer,
    color: "var(--color-pomodoro)",
  },
  {
    label: "Eisenhower",
    href: ROUTES.techniques.eisenhower,
    icon: GridFour,
    color: "var(--color-eisenhower)",
  },
  {
    label: "Time Blocking",
    href: ROUTES.techniques.timeBlocking,
    icon: CalendarBlank,
    color: "var(--color-time-blocking)",
  },
  {
    label: "Two-Minute",
    href: ROUTES.techniques.twoMinute,
    icon: Lightning,
    color: "var(--color-two-minute)",
  },
  { label: "AI Coach", href: ROUTES.coach, icon: Robot },
  { label: "Analytics", href: ROUTES.analytics, icon: ChartBar },
  { label: "Settings", href: ROUTES.settings, icon: Gear },
];

export function MobileNav() {
  const pathname = usePathname();
  const { mobileNavOpen, setMobileNavOpen } = useUIStore();

  // Close on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname, setMobileNavOpen]);

  // Lock body scroll
  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  if (!mobileNavOpen) return null;

  return (
    <div className="fixed inset-0 z-[var(--z-overlay)] md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[var(--surface-overlay)]"
        onClick={() => setMobileNavOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <nav className="absolute inset-y-0 left-0 w-72 bg-[var(--surface-primary)] shadow-xl">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-[var(--border-subtle)] px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand-600)]">
              <span className="text-sm font-bold text-white">F</span>
            </div>
            <span className="font-[family-name:var(--font-syne)] text-lg font-bold text-[var(--text-primary)]">
              FlowState
            </span>
          </div>
          <button
            onClick={() => setMobileNavOpen(false)}
            className="rounded-[var(--radius-md)] p-1.5 text-[var(--text-tertiary)] hover:bg-[var(--surface-secondary)]"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Links */}
        <div className="space-y-1 p-3">
          {ALL_NAV.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[var(--color-brand-50)] text-[var(--color-brand-700)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]"
                )}
              >
                <item.icon
                  size={20}
                  weight={isActive ? "fill" : "regular"}
                  style={
                    item.color && isActive
                      ? { color: item.color }
                      : undefined
                  }
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
