import type { CoachingTriggerDef, MethodologyId } from "../types";

import { POMODORO_TRIGGERS } from "./pomodoro";
import { EISENHOWER_TRIGGERS } from "./eisenhower";
import { GTD_TRIGGERS } from "./gtd";
import { TIME_BLOCKING_TRIGGERS } from "./time-blocking";
import { DEEP_WORK_TRIGGERS } from "./deep-work";
import { EAT_THE_FROG_TRIGGERS } from "./eat-the-frog";
import { TWO_MINUTE_TRIGGERS } from "./two-minute";
import { BATCH_TRIGGERS } from "./batch";
import { PARETO_TRIGGERS } from "./pareto";
import { TIME_AUDIT_TRIGGERS } from "./time-audit";
import { CROSS_METHODOLOGY_TRIGGERS } from "./cross-methodology";

export const ALL_TRIGGERS: CoachingTriggerDef[] = [
  ...POMODORO_TRIGGERS,
  ...EISENHOWER_TRIGGERS,
  ...GTD_TRIGGERS,
  ...TIME_BLOCKING_TRIGGERS,
  ...DEEP_WORK_TRIGGERS,
  ...EAT_THE_FROG_TRIGGERS,
  ...TWO_MINUTE_TRIGGERS,
  ...BATCH_TRIGGERS,
  ...PARETO_TRIGGERS,
  ...TIME_AUDIT_TRIGGERS,
  ...CROSS_METHODOLOGY_TRIGGERS,
];

export const TRIGGERS_BY_METHODOLOGY: Record<
  MethodologyId | "cross_methodology",
  CoachingTriggerDef[]
> = {
  pomodoro: POMODORO_TRIGGERS,
  eisenhower: EISENHOWER_TRIGGERS,
  gtd: GTD_TRIGGERS,
  time_blocking: TIME_BLOCKING_TRIGGERS,
  deep_work: DEEP_WORK_TRIGGERS,
  eat_the_frog: EAT_THE_FROG_TRIGGERS,
  two_minute: TWO_MINUTE_TRIGGERS,
  batch: BATCH_TRIGGERS,
  pareto: PARETO_TRIGGERS,
  time_audit: TIME_AUDIT_TRIGGERS,
  cross_methodology: CROSS_METHODOLOGY_TRIGGERS,
};

export function getTriggersForEvent(event: string): CoachingTriggerDef[] {
  return ALL_TRIGGERS.filter((t) => t.event === event);
}

export function getTriggersForMethodology(
  methodology: MethodologyId | "cross_methodology"
): CoachingTriggerDef[] {
  return TRIGGERS_BY_METHODOLOGY[methodology] ?? [];
}

export {
  POMODORO_TRIGGERS,
  EISENHOWER_TRIGGERS,
  GTD_TRIGGERS,
  TIME_BLOCKING_TRIGGERS,
  DEEP_WORK_TRIGGERS,
  EAT_THE_FROG_TRIGGERS,
  TWO_MINUTE_TRIGGERS,
  BATCH_TRIGGERS,
  PARETO_TRIGGERS,
  TIME_AUDIT_TRIGGERS,
  CROSS_METHODOLOGY_TRIGGERS,
};
