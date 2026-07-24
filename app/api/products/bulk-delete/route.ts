import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No product IDs provided",
        },
        { status: 400 }
      );
    }

    const result = await Product.deleteMany({
      _id: { $in: ids },
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete products",
      },
      { status: 500 }
    );
  }
}