"use server";

import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Inventory from "@/models/Inventory";

interface AdjustStockInput {
  inventoryId: string;
  variantId: string;
  type:
    | "increase"
    | "decrease"
    | "reserve"
    | "release"
    | "incoming";
  quantity: number;
}

export async function adjustStock(data: AdjustStockInput) {
  try {
    if (!mongoose.Types.ObjectId.isValid(data.inventoryId)) {
      return {
        success: false,
        message: "Invalid inventory ID.",
      };
    }

    if (!mongoose.Types.ObjectId.isValid(data.variantId)) {
      return {
        success: false,
        message: "Invalid variant ID.",
      };
    }

    if (data.quantity <= 0) {
      return {
        success: false,
        message: "Quantity must be greater than zero.",
      };
    }

    await connectDB();

    const inventory = await Inventory.findById(data.inventoryId);

    if (!inventory) {
      return {
        success: false,
        message: "Inventory not found.",
      };
    }

    const variant = inventory.variants.find(
      (v) => v.variantId.toString() === data.variantId
    );

    if (!variant) {
      return {
        success: false,
        message: "Variant not found.",
      };
    }

        switch (data.type) {
      case "increase":
        variant.availableStock += data.quantity;
        break;

      case "decrease":
        if (variant.availableStock < data.quantity) {
          return {
            success: false,
            message: "Insufficient available stock.",
          };
        }

        variant.availableStock -= data.quantity;
        break;

      case "reserve":
        if (variant.availableStock < data.quantity) {
          return {
            success: false,
            message: "Not enough available stock to reserve.",
          };
        }

        variant.availableStock -= data.quantity;
        variant.reservedStock += data.quantity;
        break;

      case "release":
        if (variant.reservedStock < data.quantity) {
          return {
            success: false,
            message: "Not enough reserved stock to release.",
          };
        }

        variant.reservedStock -= data.quantity;
        variant.availableStock += data.quantity;
        break;

      case "incoming":
        variant.incomingStock += data.quantity;
        break;

      default:
        return {
          success: false,
          message: "Invalid stock adjustment type.",
        };
    }

    await inventory.save();

    return {
      success: true,
      message: "Stock updated successfully.",
      data: JSON.parse(JSON.stringify(inventory)),
    };
  } catch (error) {
    console.error("Adjust Stock Error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to adjust stock.",
    };
  }
}