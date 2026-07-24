import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";

import { getAdminCookie } from "@/lib/auth/cookies";
import { verifyAdminToken } from "@/lib/auth/jwt";

export async function GET() {
  try {
    await connectDB();

    const token = await getAdminCookie();

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const payload = verifyAdminToken(token);

    const admin = await Admin.findById(payload.id).select("-password");

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin not found",
        },
        { status: 404 }
      );
    }

    if (!admin.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "Account disabled",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      admin,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }
}