"use client";

import { useState, useCallback, useEffect } from "react";
import { Bell, X, Check, ArrowRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CoachingNudge } from "@/types/coaching";

interface Notification {
  id: string;
  title: string;
  body: string;
  type: "nudge" | "insight" | "reminder" | "celebration" | "warning" | "daily_brief" | "weekly_review" | "suggestion" | "unlock";
  priority: "low" | "medium" | "high" | "critical";
  actionUrl?: string;
  actionLabel?: string;
  read: boolean;
  createdAt: string;
}

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const handleDismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Close on escape
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-notification-center]")) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative" data-notification-center>
      <Button
        variant="ghost"
        size="icon-sm"
        className="relative"
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-error)] text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-full z-[var(--z-dropdown)] mt-2 w-80 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-elevated)] shadow-[var(--shadow-xl)] sm:w-96">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-medium text-[var(--color-brand-600)] hover:text-[var(--color-brand-700)]"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12 text-center">
                <Bell size={32} weight="duotone" className="text-[var(--text-tertiary)]" />
                <p className="text-sm text-[var(--text-secondary)]">No notifications yet</p>
                <p className="text-xs text-[var(--text-tertiary)]">
                  Coaching nudges and insights will appear here
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex gap-3 border-b border-[var(--border-subtle)] px-4 py-3 transition-colors hover:bg-[var(--surface-secondary)]",
                    !notification.read && "bg-[var(--color-brand-50)]"
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={cn(
                        "truncate text-sm text-[var(--text-primary)]",
                        !notification.read && "font-semibold"
                      )}>
                        {notification.title}
                      </p>
                      {notification.priority === "high" || notification.priority === "critical" ? (
                        <Badge variant="destructive" className="text-[10px]">
                          {notification.priority}
                        </Badge>
                      ) : null}
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-xs text-[var(--text-secondary)]">
                      {notification.body}
                    </p>
                    {notification.actionUrl && notification.actionLabel && (
                      <a
                        href={notification.actionUrl}
                        onClick={() => {
                          handleMarkRead(notification.id);
                          setOpen(false);
                        }}
                        className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[var(--color-brand-600)] hover:text-[var(--color-brand-700)]"
                      >
                        {notification.actionLabel}
                        <ArrowRight size={10} />
                      </a>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkRead(notification.id)}
                        className="rounded-[var(--radius-sm)] p-1 text-[var(--text-tertiary)] hover:text-[var(--color-brand-600)]"
                        aria-label="Mark as read"
                      >
                        <Check size={12} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDismiss(notification.id)}
                      className="rounded-[var(--radius-sm)] p-1 text-[var(--text-tertiary)] hover:text-[var(--color-error)]"
                      aria-label="Dismiss"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
