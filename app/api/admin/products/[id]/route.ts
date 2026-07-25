import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth/admin";
import { productSchema } from "@/lib/validations/product";

// ========================= GET SINGLE PRODUCT =========================

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await params;

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        { status: 404 }
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
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}

// ========================= UPDATE PRODUCT =========================

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await params;

    const body = await req.json();

    const validatedData = productSchema.parse(body);

    const totalStock = (validatedData.variants ?? []).reduce(
  (total, variant) => total + variant.stock,
  0
);

validatedData.stock = totalStock;

    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        { status: 404 }
      );
    }

    // Prevent duplicate slug (except current product)
    const duplicateSlug = await Product.findOne({
      slug: validatedData.slug,
      _id: { $ne: id },
    });

    if (duplicateSlug) {
      return NextResponse.json(
        {
          success: false,
          message: "Slug already exists.",
        },
        { status: 400 }
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      validatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    return NextResponse.json({
      success: true,
      message: "Product updated successfully.",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update product.",
      },
      { status: 500 }
    );
  }
}

// ========================= DELETE PRODUCT =========================

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete product.",
      },
      { status: 500 }
    );
  }
}