import { z } from "zod";

const emailSchema = z
  .string()
  .email("Invalid email address")
  .min(1, { message: "email is required" });

const passwordSchema = z.string().trim().min(6, {
  message: "Password is required",
});

export const signUpSchema = z.object({
  name: z.string().trim().min(1, { message: "User name is required" }),
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
