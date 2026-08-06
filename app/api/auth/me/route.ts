import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();

    const current = await getCurrentUser();

    if (!current) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await User.findById(current.id).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
}