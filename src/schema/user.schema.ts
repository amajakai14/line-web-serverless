import z from "zod";

export type UserRole = "ADMIN" | "STAFF";

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  corporation: z.string(),
});

export type CreateUserInput = z.TypeOf<typeof createUserSchema>;

export const createStaffSchema = z.object({
  email: z.string().email(),
});

export type CreateStaffInput = z.TypeOf<typeof createUserSchema>;
