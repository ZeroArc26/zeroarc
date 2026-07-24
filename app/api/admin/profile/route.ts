import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";

import { requireAdmin } from "@/lib/auth/admin";
import {
  updateAdminProfileSchema,
} from "@/lib/validations/admin-profile";

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const currentAdmin = await requireAdmin();

    const body = await req.json();

    const parsed = updateAdminProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message ?? "Validation failed."
        },
        { status: 400 }
      );
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      currentAdmin._id,
      {
        name: parsed.data.name,
      },
      {
        new: true,
      }
    ).select("-password");

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      admin: updatedAdmin,
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