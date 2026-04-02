import { cookies } from "next/headers";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const cookieName = "rb_session";

type Role = "ADMIN" | "CUSTOMER";

export const hashPassword = (input: string) => createHash("sha256").update(input).digest("hex");

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) return null;
  return secret;
}

function sign(data: string) {
  const secret = getAuthSecret();
  if (!secret) return null;
  return createHmac("sha256", secret).update(data).digest("hex");
}

function createToken(userId: string, role: Role, ttlMs: number) {
  const exp = Date.now() + ttlMs;
  const payload = `${userId}|${role}|${exp}`;
  const signature = sign(payload);
  if (!signature) return null;
  return `${payload}|${signature}`;
}

function parseToken(token: string): { userId: string; role: Role } | null {
  const [userId, role, exp, sig] = token.split("|");
  if (!userId || !role || !exp || !sig) return null;
  const payload = `${userId}|${role}|${exp}`;
  const expected = sign(payload);
  if (!expected || sig.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  if (Number(exp) < Date.now()) return null;
  if (role !== "ADMIN" && role !== "CUSTOMER") return null;
  return { userId, role };
}

export async function createSession(userId: string, role: Role, remember = false) {
  const maxAge = remember ? 30 * 24 * 60 * 60 : 24 * 60 * 60;
  const token = createToken(userId, role, maxAge * 1000);
  if (!token) throw new Error("AUTH_SECRET is missing or invalid");
  (await cookies()).set(cookieName, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge });
}

export async function destroySession() {
  (await cookies()).delete(cookieName);
}

export async function getSession() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return null;

  try {
    return parseToken(token);
  } catch (error) {
    console.error("[auth] Failed to parse session token", error);
    return null;
  }
}

export function roleToAppRole(role: Role): "admin" | "customer" {
  return role === "ADMIN" ? "admin" : "customer";
}

export function roleToRedirect(role: Role): "/admin/dashboard" | "/listings" {
  return role === "ADMIN" ? "/admin/dashboard" : "/listings";
}
