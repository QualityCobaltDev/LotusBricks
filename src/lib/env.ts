import { z } from "zod";

const serverSchema = z.object({
  DATABASE_URL: z.string().min(1),
  AUTH_SECRET: z.string().min(16)
});

const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url()
});

const rawServerEnv = {
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_SECRET: process.env.AUTH_SECRET
};

const rawPublicEnv = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL
};

export function getServerEnv() {
  return serverSchema.safeParse(rawServerEnv);
}

export function getPublicEnv() {
  return publicSchema.safeParse(rawPublicEnv);
}

export function requireServerEnv<T extends keyof z.infer<typeof serverSchema>>(...keys: T[]): Pick<z.infer<typeof serverSchema>, T> {
  const parsed = getServerEnv();
  if (!parsed.success) {
    const missing = parsed.error.issues.map((issue) => issue.path.join(".")).join(", ");
    throw new Error(`Missing/invalid server environment variables: ${missing}`);
  }

  return keys.reduce((acc, key) => {
    acc[key] = parsed.data[key];
    return acc;
  }, {} as Pick<z.infer<typeof serverSchema>, T>);
}

export function getSafeSiteUrl() {
  const parsed = getPublicEnv();
  return parsed.success ? parsed.data.NEXT_PUBLIC_SITE_URL : "http://localhost:3000";
}
