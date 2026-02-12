"use client";

import { UserButton } from "@clerk/nextjs";
import { Bell, List, MagnifyingGlass } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/lib/stores/ui-store";

export function Topbar() {
  const { setMobileNavOpen, setCommandPaletteOpen } = useUIStore();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--surface-primary)] px-4 lg:px-6">
      {/* Left: Mobile menu + Search */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open navigation"
        >
          <List size={20} />
        </Button>

        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-secondary)] px-3 py-1.5 text-sm text-[var(--text-tertiary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-secondary)] sm:flex"
        >
          <MagnifyingGlass size={16} />
          <span>Search...</span>
          <kbd className="ml-4 rounded border border-[var(--border-default)] bg-[var(--surface-primary)] px-1.5 py-0.5 text-xs font-medium text-[var(--text-tertiary)]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          className="relative"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[var(--color-error)]" />
        </Button>

        <div className="ml-2">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-8 w-8",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
