import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

import { requireAdmin } from "@/lib/auth/admin";
import {
  productSchema,
  ProductInput,
} from "@/lib/validations/product";

export async function GET() {
  try {
    await connectDB();

    await requireAdmin();

    const products = await Product.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    await requireAdmin();

    const body = await req.json();

    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            parsed.error.issues[0]?.message ??
            "Validation failed.",
        },
        {
          status: 400,
        }
      );
    }

    const data: ProductInput = parsed.data;

    const totalStock = data.variants.reduce(
  (total, variant) => total + variant.stock,
  0
);

data.stock = totalStock;

    const slugExists = await Product.findOne({
      slug: data.slug,
    });

    if (slugExists) {
      return NextResponse.json(
        {
          success: false,
          message: "Slug already exists.",
        },
        {
          status: 400,
        }
      );
    }

    const product = await Product.create(data);

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully.",
        product,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}