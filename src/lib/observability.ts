import { Prisma } from "@prisma/client";

export function logServerError(scope: string, error: unknown, details?: Record<string, unknown>) {
  console.error(`[${scope}]`, {
    message: error instanceof Error ? error.message : "Unknown error",
    details,
    error
  });
}

export function isPrismaSchemaMismatch(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && (error.code === "P2021" || error.code === "P2022");
}
