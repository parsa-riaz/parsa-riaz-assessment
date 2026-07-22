import { z } from "zod";

export const sendMessageSchema = z.object({
  userId: z.number().int().positive(),
  question: z.string().min(1).max(1000),
});

export type SendMessageDto = z.infer<typeof sendMessageSchema>;