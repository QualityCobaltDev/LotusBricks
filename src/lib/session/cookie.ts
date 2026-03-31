import { cookies } from "next/headers";

export const sessionCookieName = "rb_role";

export async function setRoleCookie(role: "admin" | "customer") {
  const jar = await cookies();
  jar.set(sessionCookieName, role, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
}

export async function getRoleCookie() {
  const jar = await cookies();
  return jar.get(sessionCookieName)?.value;
}
