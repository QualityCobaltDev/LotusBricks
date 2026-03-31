import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(40).regex(/^[a-zA-Z0-9_]+$/),
  fullName: z.string().min(2).max(100),
  password: z.string().min(8).max(100)
});

export const loginSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(8).max(100)
});

export const forgotSchema = z.object({
  email: z.string().email()
});

export const resetSchema = z.object({
  token: z.string().min(20),
  password: z.string().min(8).max(100)
});
