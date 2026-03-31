export async function sendContactEmail(payload: { name: string; email: string; phone?: string; message: string }) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const to = process.env.SMTP_TO || process.env.SMTP_USER;

  if (!host || !port || !user || !to) {
    console.warn("SMTP env missing; inquiry email skipped", payload);
    return;
  }

  console.info("SMTP-configured inquiry captured", {
    smtpHost: host,
    smtpPort: port,
    smtpUser: user,
    smtpTo: to,
    from: payload.email,
    name: payload.name
  });
}
