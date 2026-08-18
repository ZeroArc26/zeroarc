import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";

import { getCurrentUser } from "@/lib/auth";
import { comparePassword, hashPassword } from "@/lib/auth/password";

import { changePasswordSchema } from "@/lib/validations/change-password";

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Please sign in." },
        { status: 401 }
      );
    }

    const body = await req.json();

    const parsed = changePasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message ?? "Validation failed.",
        },
        { status: 400 }
      );
    }

    const user = await User.findById(currentUser.id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const passwordMatched = await comparePassword(
      parsed.data.currentPassword,
      user.password
    );

    if (!passwordMatched) {
      return NextResponse.json(
        { success: false, message: "Current password is incorrect." },
        { status: 400 }
      );
    }

    user.password = await hashPassword(parsed.data.newPassword);
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}
