"use server";

import connectDB from "@/lib/mongodb";
import Inventory from "@/models/Inventory";
import mongoose from "mongoose";

export async function getInventoryById(id: string) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        success: false,
        message: "Invalid inventory ID.",
      };
    }

    await connectDB();

    const inventory = await Inventory.findById(id)
      .populate({
        path: "productId",
        select: "title slug category images",
      })
      .lean();

    if (!inventory) {
      return {
        success: false,
        message: "Inventory not found.",
      };
    }
        return {
      success: true,
      data: JSON.parse(JSON.stringify(inventory)),
    };
  } catch (error) {
    console.error("Get Inventory By ID Error:", error);

    return {
      success: false,
      message: "Failed to fetch inventory.",
    };
  }
}