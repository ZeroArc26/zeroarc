"use client";

import { useRouter } from "next/navigation";

import CategoryForm from "./CategoryForm";

import { updateCategory } from "@/lib/actions/categories/updateCategory";

import type { CategoryFormValues } from "@/lib/validations/category.schema";

import { toast } from "sonner";


interface EditCategoryFormProps {
  id: string;

  defaultValues: CategoryFormValues;
}


export default function EditCategoryForm({
  id,
  defaultValues,
}: EditCategoryFormProps) {

  const router = useRouter();


  async function handleUpdate(
  values: CategoryFormValues
) {
  try {

    console.log("UPDATE START", values);

    await updateCategory(
  id,
  values
);

toast.success(
  "Category updated successfully"
);

router.push(
  "/admin/dashboard/categories"
);

  } catch (error) {

    console.error("UPDATE ERROR", error);

    toast.error(
  error instanceof Error
    ? error.message
    : "Failed to update category."
);

  }
}


  return (
    <CategoryForm
      mode="edit"
      defaultValues={defaultValues}
      onSubmit={handleUpdate}
      onCancel={() =>
        router.push(
          "/admin/dashboard/categories"
        )
      }
    />
  );
}