import { z } from "zod";

//  Schema for registering a user
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(30, "Username too long"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(50, "Password too long"),
});

//  Schema for login
export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

//  Schema for forgot password
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});