"use server";

import { revalidatePath } from "next/cache";

import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

interface AdjustVariantStockInput {
  productId: string;
  variantId: string;
  stock: number;
  lowStockThreshold: number;
}

export async function adjustVariantStock(data: AdjustVariantStockInput) {
  try {
    if (data.stock < 0) {
      return { success: false, message: "Stock cannot be negative." };
    }

    await connectDB();

    const product = await Product.findById(data.productId);

    if (!product) {
      return { success: false, message: "Product not found." };
    }

    const variant = product.variants.find((v: any) => v.id === data.variantId);

    if (!variant) {
      return { success: false, message: "Variant not found." };
    }

    variant.stock = data.stock;
    variant.lowStockThreshold = data.lowStockThreshold;

    await product.save();

    revalidatePath("/admin/dashboard/inventory");
    revalidatePath("/admin/dashboard/inventory/all");

    return { success: true, message: "Stock updated successfully." };
  } catch (error) {
    console.error("Adjust Variant Stock Error:", error);
    return { success: false, message: "Failed to update stock." };
  }
}