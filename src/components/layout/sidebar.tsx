"use client";

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
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils/cn";
import { useUIStore } from "@/lib/stores/ui-store";
import { ROUTES } from "@/lib/constants/routes";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  color?: string;
  badge?: string;
}

const MAIN_NAV: NavItem[] = [
  {
    label: "Dashboard",
    href: ROUTES.dashboard,
    icon: House,
  },
];

const TECHNIQUE_NAV: NavItem[] = [
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
];

const BOTTOM_NAV: NavItem[] = [
  {
    label: "AI Coach",
    href: ROUTES.coach,
    icon: Robot,
  },
  {
    label: "Analytics",
    href: ROUTES.analytics,
    icon: ChartBar,
  },
  {
    label: "Settings",
    href: ROUTES.settings,
    icon: Gear,
  },
];

function NavLink({
  item,
  collapsed,
}: {
  item: NavItem;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");

  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-all",
        isActive
          ? "bg-[var(--color-brand-50)] text-[var(--color-brand-700)]"
          : "text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]",
        collapsed && "justify-center px-2"
      )}
      title={collapsed ? item.label : undefined}
    >
      <item.icon
        size={20}
        weight={isActive ? "fill" : "regular"}
        style={item.color && isActive ? { color: item.color } : undefined}
        className="shrink-0"
      />
      {!collapsed && <span className="truncate">{item.label}</span>}
      {!collapsed && item.badge && (
        <span className="ml-auto rounded-[var(--radius-full)] bg-[var(--color-brand-100)] px-2 py-0.5 text-xs font-medium text-[var(--color-brand-700)]">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebarCollapsed } = useUIStore();

  return (
    <aside
      className={cn(
        "hidden h-screen flex-col border-r border-[var(--border-subtle)] bg-[var(--surface-primary)] transition-all duration-[var(--duration-normal)] md:flex",
        sidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-[var(--border-subtle)] px-4">
        {!sidebarCollapsed && (
          <Link
            href={ROUTES.dashboard}
            className="flex items-center gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand-600)]">
              <span className="text-sm font-bold text-white">F</span>
            </div>
            <span className="font-[family-name:var(--font-syne)] text-lg font-bold text-[var(--text-primary)]">
              FlowState
            </span>
          </Link>
        )}
        {sidebarCollapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand-600)]">
            <span className="text-sm font-bold text-white">F</span>
          </div>
        )}
      </div>

      {/* Main Nav */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {MAIN_NAV.map((item) => (
            <NavLink key={item.href} item={item} collapsed={sidebarCollapsed} />
          ))}
        </div>

        {/* Techniques Section */}
        <div className="mt-6">
          {!sidebarCollapsed && (
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
              Techniques
            </p>
          )}
          <div className="space-y-1">
            {TECHNIQUE_NAV.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                collapsed={sidebarCollapsed}
              />
            ))}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom Nav */}
        <div className="space-y-1 border-t border-[var(--border-subtle)] pt-3">
          {BOTTOM_NAV.map((item) => (
            <NavLink key={item.href} item={item} collapsed={sidebarCollapsed} />
          ))}
        </div>
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={toggleSidebarCollapsed}
        className="flex h-10 items-center justify-center border-t border-[var(--border-subtle)] text-[var(--text-tertiary)] transition-colors hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]"
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {sidebarCollapsed ? (
          <CaretRight size={16} />
        ) : (
          <CaretLeft size={16} />
        )}
      </button>
    </aside>
  );
}
