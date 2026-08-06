import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth/jwt";
import { verifyUserToken } from "@/lib/auth/jwt";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ---------------- Admin routes ----------------
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("admin_token")?.value;

    if (pathname === "/admin/login") {
      if (token) {
        try {
          verifyAdminToken(token);
          return NextResponse.redirect(new URL("/admin", request.url));
        } catch {
          // Invalid token, continue to login page
        }
      }
      return NextResponse.next();
    }

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      verifyAdminToken(token);
      return NextResponse.next();
    } catch {
      const response = NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
      response.cookies.delete("admin_token");
      return response;
    }
  }

  // ---------------- Customer account routes ----------------
  if (pathname.startsWith("/account")) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      verifyUserToken(token);
      return NextResponse.next();
    } catch {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};