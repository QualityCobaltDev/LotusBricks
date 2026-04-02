import { Prisma } from "@prisma/client";

export type MutationResult<T = unknown> =
  | { ok: true; data?: T; message?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]>; code?: string };

export function okResult<T>(data?: T, message?: string): MutationResult<T> {
  return { ok: true, data, message };
}

export function failResult(error: string, options?: { fieldErrors?: Record<string, string[]>; code?: string }): MutationResult {
  return { ok: false, error, fieldErrors: options?.fieldErrors, code: options?.code };
}

export function toUserFacingError(error: unknown, fallback = "Unable to complete this request."): MutationResult {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") return failResult("A record with this value already exists.", { code: error.code });
    if (error.code === "P2025") return failResult("Record not found.", { code: error.code });
    return failResult("Database request failed.", { code: error.code });
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return failResult("Invalid data for this operation.");
  }

  return failResult(fallback);
}
