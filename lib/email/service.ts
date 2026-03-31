import tls from "node:tls";
import { emailLogs, createId } from "@/lib/server-store";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  type: string;
};

function cfg() {
  return {
    host: process.env.SMTP_HOST || "mail.spacemail.com",
    port: Number(process.env.SMTP_PORT || 465),
    user: process.env.SMTP_USER || "contact@rightbricks.online",
    pass: process.env.SMTP_PASS,
    secure: (process.env.SMTP_SECURE || "true") === "true"
  };
}

function toB64(v: string) {
  return Buffer.from(v).toString("base64");
}

async function runSmtpCommands(commands: string[], config: ReturnType<typeof cfg>) {
  return await new Promise<void>((resolve, reject) => {
    const socket = tls.connect({ host: config.host, port: config.port, rejectUnauthorized: false }, () => {});
    let buffer = "";
    let index = -1;

    const sendNext = () => {
      index += 1;
      if (index >= commands.length) {
        socket.end();
        resolve();
        return;
      }
      socket.write(`${commands[index]}\r\n`);
    };

    socket.on("data", (chunk) => {
      buffer += chunk.toString();
      if (!buffer.endsWith("\n")) return;
      const lines = buffer.trim().split("\n");
      const last = lines[lines.length - 1] || "";
      buffer = "";

      if (/^[45]/.test(last)) {
        reject(new Error(`SMTP error: ${last}`));
        socket.end();
        return;
      }
      if (/^[23]/.test(last) || /^250/.test(last) || /^354/.test(last) || /^220/.test(last)) {
        sendNext();
      }
    });

    socket.on("error", reject);
  });
}

export async function sendEmail(input: SendEmailInput) {
  const config = cfg();
  if (!config.pass) {
    emailLogs.unshift({ id: createId("email"), type: input.type, recipient: input.to, subject: input.subject, status: "failed", error: "SMTP_PASS is missing", createdAt: new Date().toISOString() });
    return { ok: false, error: "SMTP credentials are not configured" };
  }

  const body = `From: RightBricks <${config.user}>\r\nTo: <${input.to}>\r\nSubject: ${input.subject}\r\nMIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n${input.html}\r\n.`;

  const commands = [
    `EHLO rightbricks.online`,
    `AUTH LOGIN`,
    toB64(config.user),
    toB64(config.pass),
    `MAIL FROM:<${config.user}>`,
    `RCPT TO:<${input.to}>`,
    `DATA`,
    body,
    `QUIT`
  ];

  try {
    await runSmtpCommands(commands, config);
    emailLogs.unshift({ id: createId("email"), type: input.type, recipient: input.to, subject: input.subject, status: "success", createdAt: new Date().toISOString() });
    return { ok: true };
  } catch (error) {
    emailLogs.unshift({ id: createId("email"), type: input.type, recipient: input.to, subject: input.subject, status: "failed", error: error instanceof Error ? error.message : "Unknown error", createdAt: new Date().toISOString() });
    return { ok: false, error: "Failed to send email" };
  }
}
