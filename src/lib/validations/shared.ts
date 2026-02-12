import { z } from "zod/v4";

export const methodologySchema = z.enum([
  "pomodoro",
  "gtd",
  "eisenhower",
  "time_blocking",
  "pareto",
  "deep_work",
  "eat_the_frog",
  "two_minute",
  "batch",
  "time_audit",
]);

export type MethodologyEnum = z.infer<typeof methodologySchema>;

export const uuidSchema = z.string().uuid();

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
