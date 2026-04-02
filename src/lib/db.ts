import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const BUILD_PHASE = "phase-production-build";

function isBuildTimeProcess() {
  return process.env.NEXT_PHASE === BUILD_PHASE || process.env.SKIP_DATABASE_DURING_BUILD === "1";
}

function createPrismaClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Database-backed routes require this env var at runtime.");
  }

  return new PrismaClient();
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL) && !isBuildTimeProcess();
}

export function getDb() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }

  return globalForPrisma.prisma;
}

export const db = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getDb();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  }
});
