import { NextResponse } from "next/server";
import { Types } from "mongoose";

import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { productSchema } from "@/lib/validations/product.schema";

/* ----------------------------------------
   GET Single Product
----------------------------------------- */

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product ID.",
        },
        {
          status: 400,
        }
      );
    }

    const product = await Product.findById(id);

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

    return NextResponse.json(
      {
        success: true,
        product,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("GET Product Error:", error);

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

/* ----------------------------------------
   UPDATE Product
----------------------------------------- */

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product ID.",
        },
        {
          status: 400,
        }
      );
    }

    const body = await req.json();

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

    const existingProduct = await Product.findById(id).select(
      "pricing.sellingPrice"
    );

    if (!existingProduct) {
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

    const oldPrice = existingProduct.pricing?.sellingPrice;
    const newPrice = parsed.data.pricing?.sellingPrice;

    const updatePayload: typeof parsed.data & {
      $push?: { priceHistory: { price: number; recordedAt: Date } };
    } = { ...parsed.data };

    // Log the price we're moving away from — not the new one — so the
    // history always reflects prices the product has actually been at.
    if (
      typeof oldPrice === "number" &&
      typeof newPrice === "number" &&
      oldPrice !== newPrice
    ) {
      updatePayload.$push = {
        priceHistory: { price: oldPrice, recordedAt: new Date() },
      };
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updatePayload,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduct) {
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

    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully.",
        product: updatedProduct,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("UPDATE Product Error:", error);

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

/* ----------------------------------------
   DELETE Product
----------------------------------------- */

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product ID.",
        },
        {
          status: 400,
        }
      );
    }

    const deletedProduct =
      await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
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

    return NextResponse.json(
      {
        success: true,
        message: "Product deleted successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("DELETE Product Error:", error);

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