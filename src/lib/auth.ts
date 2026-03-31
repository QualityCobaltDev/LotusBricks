export type AuthPayload = {
  email: string;
  password: string;
};

export type AuthResult = { ok: boolean; message?: string; role?: "admin" | "customer" };

export const validateEmail = (email: string): boolean => /\S+@\S+\.\S+/.test(email);

export async function login(payload: AuthPayload): Promise<AuthResult> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return response.json();
}

export async function register(payload: AuthPayload & { name: string }): Promise<AuthResult> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return response.json();
}
