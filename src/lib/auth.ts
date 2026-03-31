export type AuthPayload = {
  email: string;
  password: string;
};

export const validateEmail = (email: string): boolean => /\S+@\S+\.\S+/.test(email);

export const login = async ({ email, password }: AuthPayload): Promise<{ ok: boolean; message?: string }> => {
  if (!validateEmail(email)) return { ok: false, message: "Please provide a valid email." };
  if (password.length < 8) return { ok: false, message: "Password must be at least 8 characters." };
  return { ok: true };
};

export const register = async (payload: AuthPayload & { name: string }) => {
  if (!payload.name.trim()) return { ok: false, message: "Name is required." };
  return login(payload);
};
