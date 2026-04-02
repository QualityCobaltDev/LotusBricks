import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

function parseRole(token: string | undefined): "ADMIN" | "CUSTOMER" | null {
  if (!token) return null;
  const parts = token.split("|");
  if (parts.length !== 4) return null;
  const role = parts[1];
  return role === "ADMIN" || role === "CUSTOMER" ? role : null;
}

function stripLocale(pathname: string): string {
  for (const locale of routing.locales) {
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1);
    if (pathname === `/${locale}`) return "/";
  }
  return pathname;
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("rb_session")?.value;
  const role = parseRole(token);
  const bare = stripLocale(req.nextUrl.pathname);

  if (!role && (bare.startsWith("/account") || bare.startsWith("/admin"))) {
    return NextResponse.redirect(new URL("/login/customer", req.url));
  }

  if (role === "CUSTOMER" && bare.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/account", req.url));
  }

  if (role === "ADMIN" && bare.startsWith("/account")) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  if (role && (bare === "/sign-in" || bare === "/login/customer" || bare === "/login/admin")) {
    return NextResponse.redirect(new URL(role === "ADMIN" ? "/admin/dashboard" : "/account", req.url));
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"]
};
