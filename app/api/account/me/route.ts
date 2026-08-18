import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const current = await getCurrentUser();

  if (!current) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    user: {
      id: current.id,
      email: current.email,
      fullName: current.fullName,
    },
  });
}
