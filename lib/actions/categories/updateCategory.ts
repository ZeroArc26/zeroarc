"use server";

import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";

import type { CategoryFormValues } from "@/lib/validations/category.schema";

export async function updateCategory(
  id: string,
  data: CategoryFormValues
) {
  await connectDB();

  const category = await Category.findById(id);

  if (!category) {
    throw new Error("Category not found.");
  }

  const updatedCategory =
    await Category.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
      }
    );

  return JSON.parse(
    JSON.stringify(updatedCategory)
  );
}