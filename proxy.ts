import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth/jwt";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;

  const pathname = request.nextUrl.pathname;

  // Allow login page
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

  // Protect all admin routes
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

export const config = {
  matcher: ["/admin/:path*"],
};