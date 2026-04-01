import { z } from "zod";

export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });
export const registerSchema = z.object({ fullName: z.string().min(2), email: z.string().email(), password: z.string().min(8) });
export const listingSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(3),
  title: z.string().min(3),
  summary: z.string().min(10),
  description: z.string().min(20),
  city: z.string().min(2),
  district: z.string().min(2),
  priceUsd: z.coerce.number().int().positive(),
  bedrooms: z.coerce.number().int().nonnegative(),
  bathrooms: z.coerce.number().int().nonnegative(),
  areaSqm: z.coerce.number().int().positive(),
  featured: z.coerce.boolean().optional().default(false),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  imageUrl: z.string().url().optional().or(z.literal("")),
  videoUrl: z.string().url().optional().or(z.literal(""))
});

export const inquirySchema = z.object({ listingId: z.string().min(1), fullName: z.string().min(2), email: z.string().email(), phone: z.string().optional(), message: z.string().min(10) });
