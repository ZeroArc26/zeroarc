import { NextResponse } from "next/server";
import { removeAdminCookie } from "@/lib/auth/cookies";

export async function POST() {
  try {
    await removeAdminCookie();

    return NextResponse.json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to logout.",
      },
      { status: 500 }
    );
  }
}