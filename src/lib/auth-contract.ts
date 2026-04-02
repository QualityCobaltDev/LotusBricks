export type AuthRole = "admin" | "customer";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: AuthRole;
};

export type AuthSuccessResponse = {
  success: true;
  user: AuthUser;
  redirectTo: "/admin/dashboard" | "/listings";
};

export type AuthErrorCode =
  | "INVALID_CREDENTIALS"
  | "AUTH_UNAVAILABLE"
  | "VALIDATION_ERROR"
  | "ACCOUNT_DISABLED"
  | "UNAUTHORIZED_ROLE";

export type AuthErrorResponse = {
  success: false;
  code: AuthErrorCode;
  message: string;
};

export function authError(code: AuthErrorCode, message: string): AuthErrorResponse {
  return { success: false, code, message };
}
