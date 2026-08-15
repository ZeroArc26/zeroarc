import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const redirectParam = req.nextUrl.searchParams.get("redirect") || "/";
  const redirectTarget =
    redirectParam.startsWith("/") && !redirectParam.startsWith("//")
      ? redirectParam
      : "/";

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
    state: redirectTarget,
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
}