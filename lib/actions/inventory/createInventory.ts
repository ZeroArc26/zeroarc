"use server";

import connectDB from "@/lib/mongodb";
import Inventory from "@/models/Inventory";
import Product from "@/models/Product";
import { inventorySchema } from "@/validators/inventory";

export async function createInventory(data: unknown) {
  try {
    await connectDB();

    const validatedData = inventorySchema.parse(data);

    const product = await Product.findById(validatedData.productId);

    if (!product) {
      return {
        success: false,
        message: "Product not found.",
      };
    }

    const existingInventory = await Inventory.findOne({
      productId: validatedData.productId,
    });

    if (existingInventory) {
      return {
        success: false,
        message: "Inventory already exists for this product.",
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

    const inventory = await Inventory.create({
      productId: validatedData.productId,
      warehouse: validatedData.warehouse,
      variants: validatedData.variants,
    });

    return {
      success: true,
      message: "Inventory created successfully.",
      data: JSON.parse(JSON.stringify(inventory)),
    };
  } catch (error) {
    console.error("Create Inventory Error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create inventory.",
    };
  }
}