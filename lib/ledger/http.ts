import { NextResponse } from "next/server";

/** Turns requireAdmin()'s "Unauthorized" throw into a 401 response. */
export function unauthorized(error: unknown) {
  if (error instanceof Error && error.message === "Unauthorized") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  return null;
}
