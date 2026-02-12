import * as Sentry from "@sentry/nextjs";

export function initSentry(): void {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) {
    console.warn("Sentry DSN not configured — error tracking disabled");
    return;
  }

  Sentry.init({
    dsn,
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: process.env.NODE_ENV ?? "development",
  });
}

export function captureError(
  error: Error,
  context?: Record<string, unknown>
): void {
  if (context) {
    Sentry.setContext("additional", context);
  }
  Sentry.captureException(error);
}

export function setUser(user: {
  id: string;
  email?: string;
  username?: string;
}): void {
  Sentry.setUser(user);
}

export function clearUser(): void {
  Sentry.setUser(null);
}

export function addBreadcrumb(
  message: string,
  category: string,
  data?: Record<string, unknown>
): void {
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: "info",
  });
}
