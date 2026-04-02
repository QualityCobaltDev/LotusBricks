import { db } from "@/lib/db";

export const SMTP_SETTING_KEY = "admin.smtp-settings.v1";

export type SmtpSettings = {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
};

export async function getSmtpSettings(): Promise<SmtpSettings | null> {
  const row = await db.siteSetting.findUnique({ where: { key: SMTP_SETTING_KEY } });
  if (!row) return null;
  const value = row.value as Partial<SmtpSettings>;

  if (!value.host || !value.user || !value.pass) return null;

  return {
    host: value.host,
    port: typeof value.port === "number" && value.port > 0 ? value.port : 465,
    user: value.user,
    pass: value.pass,
    from: value.from || value.user
  };
}

export async function upsertSmtpSettings(settings: SmtpSettings) {
  return db.siteSetting.upsert({
    where: { key: SMTP_SETTING_KEY },
    create: { key: SMTP_SETTING_KEY, value: settings },
    update: { value: settings }
  });
}
