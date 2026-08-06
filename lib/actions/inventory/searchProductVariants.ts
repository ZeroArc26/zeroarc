"use server";

import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function searchProductVariants(query: string) {
  try {
    if (!query.trim()) return { success: true, results: [] };

    await connectDB();

    const products = await Product.find({
      $or: [
        { "basicInfo.title": { $regex: query, $options: "i" } },
        { "variants.sku": { $regex: query, $options: "i" } },
      ],
    })
      .select("basicInfo.title images variants")
      .limit(10)
      .lean<any[]>();

    const results = products.flatMap((product) => {
      const coverImage =
        product.images?.find((img: any) => img.isCover)?.url ||
        product.images?.[0]?.url ||
        "";

      return (product.variants || []).map((v: any) => ({
        productId: product._id.toString(),
        productTitle: product.basicInfo?.title || "Untitled",
        productImage: coverImage,
        variantId: v.id,
        sku: v.sku,
        color: v.color,
        size: v.size,
        stock: v.stock ?? 0,
        lowStockThreshold: v.lowStockThreshold ?? 5,
      }));
    });

    return { success: true, results: results.slice(0, 15) };
  } catch (error) {
    console.error("Search Product Variants Error:", error);
    return { success: false, results: [] };
  }
}