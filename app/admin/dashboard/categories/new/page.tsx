"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import CategoryForm from "@/components/admin/categories/CategoryForm";
import type { CategoryFormValues } from "@/lib/validations/category.schema";
import { createCategoryAction } from "./actions";

export default function NewCategoryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCreateCategory(
  values: CategoryFormValues
) {
  try {
    setIsSubmitting(true);
    await createCategoryAction(values);

toast.success(
  "Category created successfully"
);

router.push(
  "/admin/dashboard/categories"
);

  } catch (error) {
  console.error(error);

  toast.error(
    error instanceof Error
      ? error.message
      : "Failed to create category."
  );

} finally {

  setIsSubmitting(false);

}
}

  return (
    <div className="space-y-8 p-6">
      {/* Header */}

      <div className="space-y-4">
        <Button
          asChild
          variant="ghost"
          className="w-fit"
        >
          <Link href="/admin/dashboard/categories">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            New Category
          </h1>

          <p className="mt-2 text-muted-foreground">
            Create a new category for your store.
          </p>
        </div>
      </div>

      {/* Form */}

      <CategoryForm
        mode="create"
        onSubmit={handleCreateCategory}
        onCancel={() =>
          router.push("/admin/dashboard/categories")
        }
      />
    </div>
  );
}