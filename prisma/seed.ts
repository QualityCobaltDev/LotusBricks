import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();
const username = "QualityCobaltDev";
const email = "qualitycobaltdev@rightbricks.local";
const password = "Banner1234!";

function hashPassword(raw: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(raw, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  const existing = await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } });
  if (existing) {
    await prisma.user.update({ where: { id: existing.id }, data: { username, role: "ADMIN", isActive: true } });
  } else {
    await prisma.user.create({ data: { username, email, passwordHash: hashPassword(password), role: "ADMIN", isVerified: true, profile: { create: { fullName: "Quality Cobalt Dev" } } } });
  }
}

main().finally(async () => prisma.$disconnect());
