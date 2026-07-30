"use server";

import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Inventory from "@/models/Inventory";

export async function deleteInventory(id: string) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        success: false,
        message: "Invalid inventory ID.",
      };
    }

    await connectDB();

    const inventory = await Inventory.findById(id);

    if (!inventory) {
      return {
        success: false,
        message: "Inventory not found.",
      };
    }

        await Inventory.findByIdAndDelete(id);

    return {
      success: true,
      message: "Inventory deleted successfully.",
    };
  } catch (error) {
    console.error("Delete Inventory Error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete inventory.",
    };
  }
}