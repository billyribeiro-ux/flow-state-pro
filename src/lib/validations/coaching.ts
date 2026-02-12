import { z } from "zod";
import { uuidSchema } from "./shared";

export const sendCoachingMessageSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1).max(5000),
    })
  ).min(1),
  conversationId: uuidSchema.optional(),
});

export const markMessageReadSchema = z.object({
  messageId: uuidSchema,
});

export const markMessageDismissedSchema = z.object({
  messageId: uuidSchema,
});

export const createConversationSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  initialMessage: z.string().min(1).max(5000),
});

export type SendCoachingMessageInput = z.infer<typeof sendCoachingMessageSchema>;
export type CreateConversationInput = z.infer<typeof createConversationSchema>;
