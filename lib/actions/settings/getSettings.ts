"use server";

import connectDB from "@/lib/mongodb";
import Settings from "@/models/Settings";

export async function getSettings() {
  try {
    await connectDB();

    let settings = await Settings.findOne({ singleton: "main" }).lean<any>();

    if (!settings) {
      const created = await Settings.create({ singleton: "main" });
      settings = created.toObject();
    }

    return { success: true, data: JSON.parse(JSON.stringify(settings)) };
  } catch (error) {
    console.error("Get Settings Error:", error);
    return { success: false, message: "Failed to fetch settings." };
  }
}