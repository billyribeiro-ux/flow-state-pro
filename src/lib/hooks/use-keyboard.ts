"use client";

import { useEffect, useCallback } from "react";

interface KeyboardShortcut {
  key: string;
  meta?: boolean;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: () => void;
  enabled?: boolean;
}

export function useKeyboard(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        if (shortcut.enabled === false) continue;

        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const metaMatch = shortcut.meta ? event.metaKey : !event.metaKey;
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey : !event.ctrlKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;

        if (keyMatch && metaMatch && ctrlMatch && shiftMatch && altMatch) {
          event.preventDefault();
          shortcut.handler();
          return;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

export function useKeyboardShortcut(
  key: string,
  handler: () => void,
  options?: { meta?: boolean; ctrl?: boolean; shift?: boolean; alt?: boolean; enabled?: boolean }
) {
  useKeyboard([{ key, handler, ...options }]);
}
