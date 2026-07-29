"use server";

import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";

export async function deleteCategory(id: string) {
  await connectDB();

  // 1. Find category first
  const category = await Category.findById(id);

  if (!category) {
    throw new Error("Category not found.");
  }


  // 2. Delete image from Bunny CDN
  if (category.image?.url) {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/upload/delete`,
        {
          method: "POST",
          body: JSON.stringify({
            url: category.image.url,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

    } catch (error) {
      console.error(
        "Bunny image delete failed:",
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