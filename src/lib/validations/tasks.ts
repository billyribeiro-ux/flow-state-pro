import { z } from "zod";
import { methodologySchema, uuidSchema } from "./shared";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(500),
  description: z.string().max(5000).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  status: z.enum(["todo", "in_progress", "completed", "cancelled"]).default("todo"),
  methodology: methodologySchema.optional(),
  eisenhowerQuadrant: z.enum(["do", "schedule", "delegate", "eliminate"]).optional(),
  gtdStatus: z.enum(["inbox", "next_action", "waiting", "someday", "reference"]).optional(),
  isTwoMinute: z.boolean().default(false),
  isFrog: z.boolean().default(false),
  frogDate: z.string().date().optional(),
  batchCategory: z.string().max(100).optional(),
  paretoCategory: z.enum(["vital_few", "trivial_many"]).optional(),
  estimatedMinutes: z.number().int().min(1).max(480).optional(),
  dueDate: z.string().datetime().optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
  parentTaskId: uuidSchema.optional(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  id: uuidSchema,
});

export const reorderTasksSchema = z.object({
  taskIds: z.array(uuidSchema).min(1),
});

export const bulkUpdateTasksSchema = z.object({
  taskIds: z.array(uuidSchema).min(1),
  updates: createTaskSchema.partial(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
