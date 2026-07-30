"use server";

import connectDB from "@/lib/mongodb";
import Inventory from "@/models/Inventory";

export async function getInventory() {
  try {
    await connectDB();

    const inventory = await Inventory.find()
      .populate({
        path: "productId",
        select: "title slug category images",
      })
      .lean();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(inventory)),
    };
  } catch (error) {
    console.error("Get Inventory Error:", error);

    return {
      success: false,
      message: "Failed to fetch inventory.",
    };
  }
}