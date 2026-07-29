import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import { getCategoryById } from "@/lib/actions/categories/getCategoryById";

import EditCategoryForm from "@/components/admin/categories/EditCategoryForm";

interface EditCategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { id } = await params;

  const category = await getCategoryById(id);

  if (!category) {
    notFound();
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
            Edit Category
          </h1>

          <p className="mt-2 text-muted-foreground">
            Update category information.
          </p>
        </div>

      </div>


      {/* Form */}

      <EditCategoryForm
  id={id}
  defaultValues={category}
/>

    </div>
  );
}