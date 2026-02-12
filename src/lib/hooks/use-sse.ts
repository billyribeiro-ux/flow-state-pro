"use client";

import { useEffect, useRef, useCallback } from "react";

type SSEHandler = (event: string, data: unknown) => void;

export function useSSE(handlers: Record<string, SSEHandler>) {
  const eventSourceRef = useRef<EventSource | null>(null);
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  const connect = useCallback(() => {
    if (typeof window === "undefined") return;

    const es = new EventSource("/api/notifications/sse");
    eventSourceRef.current = es;

    es.onopen = () => {
      console.log("SSE connected");
    };

    es.onerror = () => {
      console.warn("SSE connection error, reconnecting...");
      es.close();
      setTimeout(connect, 5000);
    };

    // Register handlers for known event types
    const eventTypes = [
      "timer.tick",
      "timer.complete",
      "coaching.nudge",
      "task.updated",
      "methodology.unlocked",
      "streak.updated",
      "notification",
    ];

    for (const type of eventTypes) {
      es.addEventListener(type, (event) => {
        try {
          const data = JSON.parse(event.data);
          handlersRef.current[type]?.(type, data);
        } catch {
          console.error(`Failed to parse SSE event: ${type}`);
        }
      });
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
    };
  }, [connect]);

  const disconnect = useCallback(() => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
  }, []);

  return { disconnect };
}
