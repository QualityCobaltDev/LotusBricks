import { z } from "zod";

const safeText = z
  .string()
  .trim()
  .max(2000)
  .transform((value) => value.replace(/[<>]/g, ""));

export const enquirySchema = z.object({
  listingSlug: z.string().min(2).max(120),
  listingTitle: z.string().min(2).max(200),
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  phone: z.string().min(6).max(30),
  message: safeText.optional(),
  sourcePage: z.string().optional()
});

export const valuationSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  phone: z.string().min(6).max(30),
  city: z.string().min(2).max(120),
  propertyType: z.string().min(2).max(80),
  details: safeText
});

export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  phone: z.string().min(6).max(30).optional(),
  subject: z.string().min(3).max(160),
  message: safeText
});
