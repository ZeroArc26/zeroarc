"use server";

import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";

import type { CategoryFormValues } from "@/lib/validations/category.schema";

export async function createCategory(
  data: CategoryFormValues
) {
  await connectDB();

  const existingCategory = await Category.findOne({
    slug: data.slug,
  }).lean();

  if (existingCategory) {
    throw new Error(
      "Category with this slug already exists."
    );
  }

  const category = await Category.create(data);

  return JSON.parse(JSON.stringify(category));
}