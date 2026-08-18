import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { productSchema } from "@/lib/validations/product.schema";

/* ----------------------------------------
   GET Products
----------------------------------------- */

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({
      "publish.status": "active",
      "publish.visibility": { $ne: "hidden" },
    }).sort({
      createdAt: -1,
    });

    return NextResponse.json(
      {
        success: true,
        count: products.length,
        products,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("GET Products Error:", error);

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

/* ----------------------------------------
   Create Product
----------------------------------------- */

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    /* ---------------- Validation ---------------- */

    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: parsed.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const data = parsed.data;

    /* ---------------- Duplicate Slug ---------------- */

    const existingSlug = await Product.findOne({
      "basicInfo.slug": data.basicInfo.slug,
    });

    if (existingSlug) {
      return NextResponse.json(
        {
          success: false,
          message: "Product slug already exists.",
        },
        {
          status: 409,
        }
      );
    }

    /* ---------------- Duplicate SKU ---------------- */

    const existingSku = await Product.findOne({
      "inventory.sku": data.inventory.sku,
    });

    if (existingSku) {
      return NextResponse.json(
        {
          success: false,
          message: "SKU already exists.",
        },
        {
          status: 409,
        }
      );
    }

    /* ---------------- Duplicate Barcode ---------------- */

if (data.inventory.barcode) {
  const existingBarcode = await Product.findOne({
    "inventory.barcode": data.inventory.barcode,
  });

  if (existingBarcode) {
    return NextResponse.json(
      {
        success: false,
        message: "Barcode already exists.",
      },
      {
        status: 409,
      }
    );
  }
}

    /* ---------------- Create Product ---------------- */

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
  console.error("Create Product Error:", error);

  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    (error as { code: number }).code === 11000
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "A product with the same Slug, SKU or Barcode already exists.",
      },
      {
        status: 409,
      }
    );
  }

  return NextResponse.json(
    {
      success: false,
      message: "Internal server error.",
    },
    {
      status: 500,
    }
  );
}
}