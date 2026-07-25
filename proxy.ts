import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;

  console.log("PATH:", request.nextUrl.pathname);
  console.log("TOKEN:", token ? "FOUND" : "NOT FOUND");

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};