import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function readSession(token?: string) {
  if (!token) return null;
  const [userId, role, expRaw] = token.split(".");
  const exp = Number(expRaw);
  if (!userId || !role || !Number.isFinite(exp) || exp * 1000 < Date.now()) return null;
  return { userId, role };
}

export function middleware(req: NextRequest) {
  const session = readSession(req.cookies.get("rb_session")?.value);
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
