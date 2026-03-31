import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const role = request.cookies.get("rb_role")?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/login?next=/admin", request.url));
  }

  if (pathname.startsWith("/account") && !role) {
    return NextResponse.redirect(new URL("/login?next=/account", request.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/account/:path*"] };
