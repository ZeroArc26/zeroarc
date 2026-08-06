"use server";

import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export interface VariantInventoryRow {
  productId: string;
  productTitle: string;
  productImage: string;
  category: string;
  variantId: string;
  sku: string;
  color: string;
  size: string;
  stock: number;
  lowStockThreshold: number;
  isActive: boolean;
}

export async function getProductVariantInventory() {
  try {
    await connectDB();

    const products = await Product.find()
      .select("basicInfo.title basicInfo.category images variants")
      .lean<any[]>();

    const rows: VariantInventoryRow[] = [];

    for (const product of products) {
      const coverImage =
        product.images?.find((img: any) => img.isCover)?.url ||
        product.images?.[0]?.url ||
        "";

      for (const variant of product.variants || []) {
        rows.push({
          productId: product._id.toString(),
          productTitle: product.basicInfo?.title || "Untitled",
          productImage: coverImage,
          category: product.basicInfo?.category || "",
          variantId: variant.id,
          sku: variant.sku,
          color: variant.color,
          size: variant.size,
          stock: variant.stock ?? 0,
          lowStockThreshold: variant.lowStockThreshold ?? 5,
          isActive: variant.isActive ?? true,
        });
      }
    }

    const totalSkus = rows.length;
    const totalUnits = rows.reduce((sum, r) => sum + r.stock, 0);
    const lowStock = rows.filter(
      (r) => r.stock > 0 && r.stock <= r.lowStockThreshold
    ).length;
    const outOfStock = rows.filter((r) => r.stock === 0).length;

    // Category snapshot for the dashboard chart.
    const byCategory = new Map<string, number>();
    for (const r of rows) {
      byCategory.set(r.category, (byCategory.get(r.category) || 0) + r.stock);
    }

    return {
      success: true,
      rows,
      stats: { totalSkus, totalUnits, lowStock, outOfStock },
      categoryBreakdown: Array.from(byCategory.entries()).map(
        ([category, units]) => ({ category: category || "Uncategorized", units })
      ),
    };
  } catch (error) {
    console.error("Get Product Variant Inventory Error:", error);
    return {
      success: false,
      message: "Failed to fetch inventory.",
      rows: [],
      stats: { totalSkus: 0, totalUnits: 0, lowStock: 0, outOfStock: 0 },
      categoryBreakdown: [],
    };
  }
}