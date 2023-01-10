import z from "zod";

export type UserRole = "ADMIN" | "STAFF";

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type CreateUserInput = z.TypeOf<typeof createUserSchema>;
