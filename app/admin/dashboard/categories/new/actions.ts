"use server";

import { createCategory } from "@/lib/actions/categories/createCategory";
import type { CategoryFormValues } from "@/lib/validations/category.schema";

export async function createCategoryAction(
  values: CategoryFormValues
) {
  return await createCategory(values);
}