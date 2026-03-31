import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function readSession(token?: string) {
  if (!token) return null;
  const [userId, role, expRaw, signature] = token.split(".");
  const exp = Number(expRaw);
  if (!userId || !role || !signature || !Number.isFinite(exp) || exp * 1000 < Date.now()) return null;

  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) return null;
  const payload = `${userId}.${role}.${expRaw}`;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  const expected = Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
  if (expected !== signature) return null;

  return { userId, role };
}

export async function middleware(req: NextRequest) {
  const session = await readSession(req.cookies.get("rb_session")?.value);
  const { pathname, search } = req.nextUrl;

  if (pathname.startsWith("/account") && !session) {
    return NextResponse.redirect(new URL(`/auth/login?redirect=${encodeURIComponent(pathname + search)}`, req.url));
  }

  if (pathname.startsWith("/admin")) {
    if (!session) return NextResponse.redirect(new URL("/auth/login?redirect=/admin", req.url));
    if (session.role !== "ADMIN" && session.role !== "OPS") return NextResponse.redirect(new URL("/auth/login?error=unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/account/:path*", "/admin/:path*"] };
