import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().min(1),
  AUTH_SECRET: z.string().min(16),
  NEXT_PUBLIC_SITE_URL: z.string().url()
});

export const env = schema.parse(process.env);
