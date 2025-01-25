import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(3)
  .max(255)
  .email("Invalid email address");

export const passwordSchema = z.string().trim().min(6);

export const registerSchema = z.object({
  name: z.string().trim().min(3).max(255),
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
