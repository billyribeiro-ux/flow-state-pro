import type { DeliveryStrategy } from "./types";

export const DELIVERY_STRATEGY: DeliveryStrategy = {
  maxPerHour: {
    aggressive: 6,
    moderate: 3,
    minimal: 1,
  },
  maxPerDay: {
    aggressive: 30,
    moderate: 15,
    minimal: 5,
  },
  channelPriority: {
    low: ["in_app"],
    medium: ["in_app", "push"],
    high: ["push", "in_app"],
    critical: ["push", "in_app", "email"],
  },
  quietHoursExceptions: ["critical"],
};
