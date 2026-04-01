import { cookies } from "next/headers";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { requireServerEnv } from "./env";

const cookieName = "rb_session";

type Role = "ADMIN" | "CUSTOMER";

export const hashPassword = (input: string) => createHash("sha256").update(input).digest("hex");

function getAuthSecret() {
  return requireServerEnv("AUTH_SECRET").AUTH_SECRET;
}

function sign(data: string) {
  return createHmac("sha256", getAuthSecret()).update(data).digest("hex");
}

function createToken(userId: string, role: Role) {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = `${userId}|${role}|${exp}`;
  return `${payload}|${sign(payload)}`;
}

function parseToken(token: string): { userId: string; role: Role } | null {
  const [userId, role, exp, sig] = token.split("|");
  if (!userId || !role || !exp || !sig) return null;
  const payload = `${userId}|${role}|${exp}`;
  const expected = sign(payload);
  if (sig.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  if (Number(exp) < Date.now()) return null;
  if (role !== "ADMIN" && role !== "CUSTOMER") return null;
  return { userId, role };
}

export async function createSession(userId: string, role: Role) {
  (await cookies()).set(cookieName, createToken(userId, role), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" });
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

export function roleToRedirect(role: Role): "/admin/dashboard" | "/account" {
  return role === "ADMIN" ? "/admin/dashboard" : "/account";
}
