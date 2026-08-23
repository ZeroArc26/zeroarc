import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth/admin";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    await connectDB();

    const { searchParams } = new URL(request.url);
    const barcode = (searchParams.get("barcode") || "").trim();

    if (!barcode) {
      return NextResponse.json(
        { success: false, message: "No barcode provided." },
        { status: 400 }
      );
    }

    // One barcode per product — covers every color/size of that product.
    const product = await Product.findOne({ "inventory.barcode": barcode }).lean<any>();

    if (!product) {
      return NextResponse.json(
        { success: false, message: "No product found for this barcode." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product: {
        _id: product._id,
        title: product.basicInfo?.title,
        image:
          product.images?.find((img: { isCover?: boolean }) => img.isCover)?.url ||
          product.images?.[0]?.url ||
          "",
        sellingPrice: product.pricing?.sellingPrice,
        variants: (product.variants || []).map((v: {
          color: string;
          colorHex?: string;
          size: string;
          stock: number;
          price: number;
        }) => ({
          color: v.color,
          colorHex: v.colorHex,
          size: v.size,
          stock: v.stock,
          price: v.price,
        })),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : undefined;
    if (message === "Unauthorized") {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    console.error("POS BARCODE LOOKUP ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Lookup failed." },
      { status: 500 }
    );
  }
}
