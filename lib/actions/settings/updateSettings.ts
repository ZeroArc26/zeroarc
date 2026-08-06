"use server";

import { revalidatePath } from "next/cache";

import connectDB from "@/lib/mongodb";
import Settings from "@/models/Settings";

export async function updateSettings(section: string, data: Record<string, any>) {
  try {
    await connectDB();

    const allowedSections = [
      "store",
      "address",
      "tax",
      "shipping",
      "notifications",
      "social",
      "seo",
    ];

    if (!allowedSections.includes(section)) {
      return { success: false, message: "Invalid settings section." };
    }

    const settings = await Settings.findOneAndUpdate(
      { singleton: "main" },
      { $set: { [section]: data } },
      { new: true, upsert: true }
    ).lean();

    revalidatePath("/admin/dashboard/settings");

    return { success: true, data: JSON.parse(JSON.stringify(settings)) };
  } catch (error) {
    console.error("Update Settings Error:", error);
    return { success: false, message: "Failed to update settings." };
  }
}