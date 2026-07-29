import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import { categorySchema } from "@/lib/validations/category.schema";

/* ----------------------------------------
   GET Categories
----------------------------------------- */

export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find()
      .sort({ sortOrder: 1, createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        categories,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("GET Categories Error:", error);

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
   CREATE Category
----------------------------------------- */

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const parsed = categorySchema.safeParse(body);

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

    const exists = await Category.findOne({
      slug: parsed.data.slug,
    });

    if (exists) {
      return NextResponse.json(
        {
          success: false,
          message: "Category slug already exists.",
        },
        {
          status: 409,
        }
      );
    }

    const category = await Category.create(parsed.data);

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully.",
        category,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("CREATE Category Error:", error);

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