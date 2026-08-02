import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    await connectDB();

    const { slug } = await params;

    const product = await Product.findOne({
      "basicInfo.slug": slug,
      "publish.status": "active",
    });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch product.",
      },
      {
        status: 500,
      }
    );
  }
}