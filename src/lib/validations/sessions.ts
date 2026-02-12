import { z } from "zod";
import { methodologySchema, uuidSchema } from "./shared";

export const startSessionSchema = z.object({
  methodology: methodologySchema,
  sessionType: z.enum(["focus", "break", "long_break", "deep_work", "frog", "batch"]),
  plannedDuration: z.number().int().min(60).max(14400), // 1 min to 4 hours in seconds
  taskIds: z.array(uuidSchema).optional(),
  timeBlockId: uuidSchema.optional(),
});

export const completeSessionSchema = z.object({
  sessionId: uuidSchema,
  actualDuration: z.number().int().min(0),
  pomodoroCount: z.number().int().min(0).optional(),
  distractionCount: z.number().int().min(0).optional(),
  qualityRating: z.number().int().min(1).max(5).optional(),
  notes: z.string().max(2000).optional(),
});

export const pauseSessionSchema = z.object({
  sessionId: uuidSchema,
});

export const abandonSessionSchema = z.object({
  sessionId: uuidSchema,
  reason: z.string().max(500).optional(),
});

export type StartSessionInput = z.infer<typeof startSessionSchema>;
export type CompleteSessionInput = z.infer<typeof completeSessionSchema>;
