import { trackEvent } from "./posthog";

// Session events
export function trackSessionStarted(data: {
  methodology: string;
  sessionType: string;
  plannedDuration: number;
}): void {
  trackEvent("session_started", data);
}

export function trackSessionCompleted(data: {
  methodology: string;
  sessionType: string;
  actualDuration: number;
  plannedDuration: number;
  pomodoroCount?: number;
  distractionCount?: number;
}): void {
  trackEvent("session_completed", data);
}

export function trackSessionAbandoned(data: {
  methodology: string;
  sessionType: string;
  elapsedDuration: number;
  reason?: string;
}): void {
  trackEvent("session_abandoned", data);
}

// Task events
export function trackTaskCreated(data: {
  methodology?: string;
  priority?: string;
  hasDeadline: boolean;
}): void {
  trackEvent("task_created", data);
}

export function trackTaskCompleted(data: {
  methodology?: string;
  timeSpent?: number;
  wasOverdue: boolean;
}): void {
  trackEvent("task_completed", data);
}

// Methodology events
export function trackMethodologySelected(data: {
  methodology: string;
  isFirstTime: boolean;
}): void {
  trackEvent("methodology_selected", data);
}

export function trackMethodologyUnlocked(data: {
  methodology: string;
  prerequisite: string;
}): void {
  trackEvent("methodology_unlocked", data);
}

// Coaching events
export function trackCoachingMessageViewed(data: {
  messageType: string;
  trigger: string;
}): void {
  trackEvent("coaching_message_viewed", data);
}

export function trackCoachingConversationStarted(): void {
  trackEvent("coaching_conversation_started");
}

// Onboarding events
export function trackOnboardingStarted(): void {
  trackEvent("onboarding_started");
}

export function trackOnboardingCompleted(data: {
  selectedMethodology: string;
  timeSpent: number;
}): void {
  trackEvent("onboarding_completed", data);
}

// Video events
export function trackVideoStarted(data: {
  methodology: string;
  muxAssetId: string;
}): void {
  trackEvent("video_started", data);
}

export function trackVideoCompleted(data: {
  methodology: string;
  muxAssetId: string;
  watchTime: number;
}): void {
  trackEvent("video_completed", data);
}

// Feature usage
export function trackFeatureUsed(feature: string, metadata?: Record<string, unknown>): void {
  trackEvent("feature_used", { feature, ...metadata });
}
