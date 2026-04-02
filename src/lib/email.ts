import tls from "node:tls";
import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import { getContactSettings } from "@/lib/site-settings";
import { getSmtpSettings } from "@/lib/smtp-settings";

export type EmailTemplateData = {
  heading: string;
  intro: string;
  rows?: Array<{ label: string; value: string }>;
  ctaLabel?: string;
  ctaHref?: string;
  closing?: string;
};

function renderTemplate(data: EmailTemplateData, contact: { phoneDisplay: string; email: string }) {
  const rows = (data.rows ?? [])
    .map((r) => `<tr><td style="padding:6px 0;color:#4c5a74;font-size:13px;width:170px">${r.label}</td><td style="padding:6px 0;color:#131a2b;font-size:14px">${r.value}</td></tr>`)
    .join("");

  return `<div style="background:#f1f3f8;padding:24px 12px;font-family:Arial,sans-serif"><table role="presentation" style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #d0d7e4"><tr><td style="background:#1149aa;color:#fff;padding:18px 24px;font-weight:700;font-size:20px">RightBricks</td></tr><tr><td style="padding:24px"><h1 style="margin:0 0 12px;font-size:22px;color:#131a2b">${data.heading}</h1><p style="margin:0 0 12px;color:#364259;line-height:1.5">${data.intro}</p>${rows ? `<table role="presentation" style="width:100%;border-top:1px solid #d0d7e4;border-bottom:1px solid #d0d7e4;padding:8px 0;margin:14px 0">${rows}</table>` : ""}${data.ctaLabel && data.ctaHref ? `<a href="${data.ctaHref}" style="display:inline-block;margin-top:10px;background:#1149aa;color:#fff;padding:10px 14px;border-radius:8px;text-decoration:none;font-weight:600">${data.ctaLabel}</a>` : ""}<p style="margin:16px 0 0;color:#364259">${data.closing ?? "Our team will contact you shortly via phone or email."}</p></td></tr><tr><td style="background:#f8f9fc;color:#4c5a74;padding:16px 24px;font-size:13px">Contact: ${contact.email} · ${contact.phoneDisplay}</td></tr></table></div>`;
}

const readLine = (socket: tls.TLSSocket) =>
  new Promise<string>((resolve, reject) => {
    const onData = (chunk: Buffer) => {
      const text = chunk.toString();
      if (text.includes("\n")) {
        socket.off("data", onData);
        resolve(text);
      }
    };
    socket.on("data", onData);
    socket.once("error", reject);
  });

async function sendSmtpMail({ host, port, user, pass, from, to, subject, html }: { host: string; port: number; user: string; pass: string; from: string; to: string; subject: string; html: string }) {
  const socket = tls.connect(port, host, { rejectUnauthorized: false });
  await new Promise((resolve, reject) => socket.once("secureConnect", resolve).once("error", reject));

  const send = async (cmd: string) => {
    socket.write(`${cmd}\r\n`);
    return await readLine(socket);
  };

  await readLine(socket);
  await send("EHLO rightbricks.online");
  await send("AUTH LOGIN");
  await send(Buffer.from(user).toString("base64"));
  await send(Buffer.from(pass).toString("base64"));
  await send(`MAIL FROM:<${from}>`);
  await send(`RCPT TO:<${to}>`);
  await send("DATA");

  const boundary = randomUUID();
  socket.write(`From: ${from}\r\nTo: ${to}\r\nSubject: ${subject}\r\nMIME-Version: 1.0\r\nContent-Type: multipart/alternative; boundary="${boundary}"\r\n\r\n--${boundary}\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n${html}\r\n\r\n--${boundary}--\r\n.\r\n`);
  await readLine(socket);
  await send("QUIT");
  socket.end();
}

export async function sendTransactionalEmail(params: {
  type: string;
  to: string;
  subject: string;
  template: EmailTemplateData;
  metadata?: Record<string, unknown>;
}) {
  const contact = await getContactSettings();
  const html = renderTemplate(params.template, contact);

  const savedSmtp = await getSmtpSettings();
  const host = savedSmtp?.host ?? process.env.SMTP_HOST;
  const port = savedSmtp?.port ?? Number(process.env.SMTP_PORT ?? 465);
  const user = savedSmtp?.user ?? process.env.SMTP_USER;
  const pass = savedSmtp?.pass ?? process.env.SMTP_PASS;
  const from = savedSmtp?.from ?? process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "contact@rightbricks.online";

  if (!host || !user || !pass) {
    await db.emailLog.create({ data: { type: params.type, recipient: params.to, subject: params.subject, status: "FAILED", error: "SMTP missing env vars", metadata: params.metadata as any } });
    return { ok: false };
  }

  try {
    await sendSmtpMail({ host, port, user, pass, from, to: params.to, subject: params.subject, html });
    await db.emailLog.create({ data: { type: params.type, recipient: params.to, subject: params.subject, status: "SENT", metadata: params.metadata as any } });
    return { ok: true };
  } catch (error) {
    await db.emailLog.create({ data: { type: params.type, recipient: params.to, subject: params.subject, status: "FAILED", error: error instanceof Error ? error.message : "Unknown error", metadata: params.metadata as any } });
    return { ok: false };
  }
}
