import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth/admin";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") || "").trim();

    const filter: Record<string, unknown> = {
      "publish.status": "active",
    };

    if (query) {
      // Match every word the user typed, regardless of order — e.g.
      // "Tee Blank" should still find "Blank Customizable Tee".
      const words = query.split(/\s+/).filter(Boolean);
      filter["$and"] = words.map((word) => ({
        "basicInfo.title": { $regex: word, $options: "i" },
      }));
    }

    const products = await Product.find(filter)
      .select("basicInfo.title basicInfo.slug images pricing variants inventory")
      .limit(20)
      .lean();

    return NextResponse.json({
      success: true,
      products: products.map((p: any) => ({
        _id: p._id,
        title: p.basicInfo?.title,
        image: p.images?.find((img: any) => img.isCover)?.url || p.images?.[0]?.url || "",
        sellingPrice: p.pricing?.sellingPrice,
        sku: p.inventory?.sku || "",
        barcode: p.inventory?.barcode || "",
        variants: (p.variants || []).map((v: any) => ({
          color: v.color,
          size: v.size,
          stock: v.stock,
          price: v.price,
        })),
      })),
    });
  } catch (error: any) {
    if (error?.message === "Unauthorized") {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }
    console.error("MANUAL ORDER PRODUCT SEARCH ERROR:", error);
    return NextResponse.json({ success: false, message: "Search failed." }, { status: 500 });
  }
}
