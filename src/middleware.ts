import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCanonicalRedirectUrl } from "@/lib/routing";

function parseRole(token: string | undefined): "ADMIN" | "CUSTOMER" | null {
  if (!token) return null;
  const parts = token.split("|");
  if (parts.length !== 4) return null;
  const role = parts[1];
  return role === "ADMIN" || role === "CUSTOMER" ? role : null;
}

export function middleware(req: NextRequest) {
  const canonicalRedirect = getCanonicalRedirectUrl({
    host: req.headers.get("host"),
    pathname: req.nextUrl.pathname,
    search: req.nextUrl.search,
    protocol: req.nextUrl.protocol
  });

  if (canonicalRedirect) {
    return NextResponse.redirect(canonicalRedirect, 301);
  }

  const token = req.cookies.get("rb_session")?.value;
  const role = parseRole(token);
  const { pathname } = req.nextUrl;

  if (!role && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login/admin", req.url));
  }

  if (role === "CUSTOMER" && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/account") || pathname === "/login/customer" || pathname === "/sign-in") {
    return NextResponse.redirect(new URL("/listings", req.url));
  }

  if (role === "ADMIN" && pathname === "/login/admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"]
};
