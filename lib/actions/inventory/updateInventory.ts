"use server";

import connectDB from "@/lib/mongodb";
import Inventory from "@/models/Inventory";
import Product from "@/models/Product";
import mongoose, { Types } from "mongoose";
import { inventorySchema } from "@/validators/inventory";

export async function updateInventory(
  id: string,
  data: unknown
) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        success: false,
        message: "Invalid inventory ID.",
      };
    }

    await connectDB();

    const validatedData = inventorySchema.parse(data);

    const inventory = await Inventory.findById(id);

    if (!inventory) {
      return {
        success: false,
        message: "Inventory not found.",
      };
    }

    const product = await Product.findById(validatedData.productId);

    if (!product) {
      return {
        success: false,
        message: "Product not found.",
      };
    }

    const skuSet = new Set<string>();

    for (const variant of validatedData.variants) {
      if (skuSet.has(variant.sku)) {
        return {
          success: false,
          message: `Duplicate SKU found: ${variant.sku}`,
        };
      }

      skuSet.add(variant.sku);
    }

        inventory.productId = new Types.ObjectId(validatedData.productId);
    inventory.warehouse = validatedData.warehouse;
    inventory.variants = validatedData.variants.map((variant) => ({
  ...variant,
  variantId: new Types.ObjectId(variant.variantId),
}));

    await inventory.save();

    return {
      success: true,
      message: "Inventory updated successfully.",
      data: JSON.parse(JSON.stringify(inventory)),
    };
  } catch (error) {
    console.error("Update Inventory Error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update inventory.",
    };
  }
}