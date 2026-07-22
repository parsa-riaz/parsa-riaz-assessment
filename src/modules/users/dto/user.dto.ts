import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(100),

  email: z
    .string()
    .trim()
    .email("Invalid email address"),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;