import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";

import { signUserToken } from "@/lib/auth/jwt";
import { setUserCookie } from "@/lib/auth/cookies";

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/login?error=google_auth_failed`
      );
    }

    await connectDB();

    // Step 1: exchange the code for an access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("Google token exchange failed:", tokenData);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/login?error=google_auth_failed`
      );
    }

    // Step 2: fetch the user's Google profile
    const profileResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      }
    );

    const profile = await profileResponse.json();

    if (!profile.email) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/login?error=google_auth_failed`
      );
    }

    // Step 3: find or create the User
    let user = await User.findOne({ email: profile.email.toLowerCase() });

    if (!user) {
      user = await User.create({
        fullName: profile.name || profile.email.split("@")[0],
        email: profile.email.toLowerCase(),
        // Random unguessable password — this account can only ever
        // log in via Google, never via the email+password form.
        password: `google-oauth-${crypto.randomUUID()}`,
        avatar: profile.picture || "",
        isVerified: true,
      });
    }

    // Step 4: sign in exactly like normal email/password login
    const token = signUserToken({
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
    });

    await setUserCookie(token);

    return NextResponse.redirect(process.env.NEXT_PUBLIC_APP_URL!);
  } catch (error) {
    console.error("Google OAuth error:", error);

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/login?error=google_auth_failed`
    );
  }
}