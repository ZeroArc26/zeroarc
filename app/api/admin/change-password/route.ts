import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";

import { requireAdmin } from "@/lib/auth/admin";
import {
  comparePassword,
  hashPassword,
} from "@/lib/auth/password";

import { changePasswordSchema } from "@/lib/validations/change-password";

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const currentAdmin = await requireAdmin();

    const body = await req.json();

    const parsed = changePasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            parsed.error.issues[0]?.message ??
            "Validation failed.",
        },
        {
          status: 400,
        }
      );
    }

    const admin = await Admin.findById(currentAdmin._id);

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin not found.",
        },
        {
          status: 404,
        }
      );
    }

    const passwordMatched = await comparePassword(
      parsed.data.currentPassword,
      admin.password
    );

    if (!passwordMatched) {
      return NextResponse.json(
        {
          success: false,
          message: "Current password is incorrect.",
        },
        {
          status: 400,
        }
      );
    }

    admin.password = await hashPassword(
      parsed.data.newPassword
    );

    await admin.save();

    return NextResponse.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}