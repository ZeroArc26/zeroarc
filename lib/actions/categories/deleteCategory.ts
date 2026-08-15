"use server";

import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import { deleteFromImageKit } from "@/lib/imagekit";

export async function deleteCategory(id: string) {
  await connectDB();

  // 1. Find category first
  const category = await Category.findById(id);

  if (!category) {
    throw new Error("Category not found.");
  }


  // 2. Delete image from ImageKit
  if (category.image?.url) {
    try {
      await deleteFromImageKit(category.image.url);
    } catch (error) {
      console.error(
        "ImageKit image delete failed:",
        error
      );
    }
  }


  // 3. Delete category from MongoDB
  await Category.findByIdAndDelete(id);


  return {
    success: true,
  };
}