import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";

export async function getCategoryById(
  id: string
) {
  console.log("GET CATEGORY ID:", id);

  await connectDB();

  const category =
    await Category.findById(id).lean();

  console.log(
    "FOUND CATEGORY:",
    category
  );

  if (!category) {
    throw new Error(
      "Category not found."
    );
  }

  return JSON.parse(
    JSON.stringify(category)
  );
}