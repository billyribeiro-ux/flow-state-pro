import posthog from "posthog-js";

let initialized = false;

export function initPostHog(): void {
  if (initialized || typeof window === "undefined") return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com";

  if (!key) {
    console.warn("PostHog key not configured — analytics disabled");
    return;
  }

  posthog.init(key, {
    api_host: host,
    capture_pageview: false,
    capture_pageleave: true,
    persistence: "localStorage+cookie",
    loaded: () => {
      initialized = true;
    },
  });
}

export function identifyUser(
  userId: string,
  properties?: Record<string, unknown>
): void {
  if (!initialized) return;
  posthog.identify(userId, properties);
}

export function trackEvent(
  event: string,
  properties?: Record<string, unknown>
): void {
  if (!initialized) return;
  posthog.capture(event, properties);
}

export function trackPageView(url: string): void {
  if (!initialized) return;
  posthog.capture("$pageview", { $current_url: url });
}

export function resetUser(): void {
  if (!initialized) return;
  posthog.reset();
}

export function setUserProperties(
  properties: Record<string, unknown>
): void {
  if (!initialized) return;
  posthog.setPersonProperties(properties);
}

export { posthog };
