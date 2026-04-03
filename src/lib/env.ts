import { z } from "zod";

const serverSchema = z.object({
  DATABASE_URL: z.string().min(1),
  AUTH_SECRET: z.string().min(16),
  SMTP_HOST: z.string().min(1).optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_USER: z.string().email().optional(),
  SMTP_PASS: z.string().min(1).optional(),
  SMTP_SECURE: z.enum(["true", "false"]).optional(),
  SMTP_FROM: z.string().optional()
});

const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url()
});

const rawServerEnv = {
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_SECURE: process.env.SMTP_SECURE,
  SMTP_FROM: process.env.SMTP_FROM
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

function normalizeUrl(url: string) {
  try {
    return new URL(url);
  } catch {
    return new URL("https://rightbricks.online");
  }
}

export function getSafeSiteUrl() {
  const parsed = getPublicEnv();
  return parsed.success ? parsed.data.NEXT_PUBLIC_SITE_URL : "https://rightbricks.online";
}

export function getCanonicalSiteUrl() {
  const parsed = normalizeUrl(getSafeSiteUrl());
  const canonicalHost = (process.env.NEXT_PUBLIC_CANONICAL_HOST ?? parsed.hostname).trim().toLowerCase();
  parsed.hostname = canonicalHost;
  parsed.port = "";
  parsed.pathname = "";
  parsed.search = "";
  parsed.hash = "";
  return parsed.toString().replace(/\/$/, "");
}
