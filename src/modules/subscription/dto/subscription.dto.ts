import { z } from "zod";

export const createSubscriptionSchema = z.object({
    userId: z.number().int().positive(),
    planId: z.number().int().positive(),
    autoRenew: z.boolean().default(false),
});

export type CreateSubscriptionDto = z.infer<typeof createSubscriptionSchema>;