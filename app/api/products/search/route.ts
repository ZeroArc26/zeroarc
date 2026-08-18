import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || "";

    if (!q) {
      return NextResponse.json({ success: true, products: [] });
    }

    await connectDB();

    const raw = await Product.find({
      "publish.status": "active",
      "publish.visibility": { $ne: "hidden" },
      "basicInfo.title": { $regex: q, $options: "i" },
    })
      .limit(5)
      .lean();

    const products = raw.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
    }));

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("PRODUCT SEARCH ERROR:", error);
    return NextResponse.json(
      { success: false, products: [] },
      { status: 500 }
    );
  }
}