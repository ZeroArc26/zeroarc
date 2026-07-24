import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";

import { getAdminCookie } from "./cookies";
import { verifyAdminToken } from "./jwt";

export async function getCurrentAdmin() {
  try {
    await connectDB();

    const token = await getAdminCookie();

    if (!token) {
      return null;
    }

    const payload = verifyAdminToken(token);

    const admin = await Admin.findById(payload.id).select("-password");

    if (!admin) {
      return null;
    }

    if (!admin.isActive) {
      return null;
    }

    return admin;
  } catch (error) {
    console.error("getCurrentAdmin Error:", error);
    return null;
  }
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    throw new Error("Unauthorized");
  }

  return admin;
}

export async function requireRole(
  roles: ("SUPER_ADMIN" | "ADMIN" | "STAFF")[]
) {
  const admin = await requireAdmin();

  if (!roles.includes(admin.role)) {
    throw new Error("Forbidden");
  }

  return admin;
}