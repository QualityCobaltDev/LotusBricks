import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function parseRole(token: string | undefined): "ADMIN" | "CUSTOMER" | null {
  if (!token) return null;
  const parts = token.split("|");
  if (parts.length !== 4) return null;
  const role = parts[1];
  return role === "ADMIN" || role === "CUSTOMER" ? role : null;
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("rb_session")?.value;
  const role = parseRole(token);
  const { pathname } = req.nextUrl;

  if (!role && (pathname.startsWith("/account") || pathname.startsWith("/admin"))) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (role === "CUSTOMER" && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/account", req.url));
  }

  if (role === "ADMIN" && pathname.startsWith("/account")) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  if (role && pathname === "/sign-in") {
    return NextResponse.redirect(new URL(role === "ADMIN" ? "/admin/dashboard" : "/account", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/sign-in"]
};
