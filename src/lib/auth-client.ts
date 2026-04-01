import type { AuthErrorResponse } from "@/lib/auth-contract";

export function toSignInErrorMessage(error: AuthErrorResponse | null | undefined) {
  if (!error) return "Authentication service is temporarily unavailable. Please try again.";

  if (error.code === "INVALID_CREDENTIALS") return "Invalid email or password";
  if (error.code === "AUTH_UNAVAILABLE") return "Authentication service is temporarily unavailable. Please try again.";
  return error.message;
}
