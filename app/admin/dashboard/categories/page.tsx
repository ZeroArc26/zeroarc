import Link from "next/link";
import {
  FolderTree,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { getCategories } from "@/lib/actions/categories/getCategories";
import CategoriesClient from "@/components/admin/categories/CategoriesClient";

export default async function CategoriesPage() {
  const categories = await getCategories();
  console.log("CATEGORIES:", categories);
  return (
    <div className="space-y-8 p-6">

      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Categories
          </h1>

          <p className="mt-1 text-muted-foreground">
            Organize and manage product categories for your store.
          </p>
        </div>

        <Button asChild size="lg">
          <Link href="/admin/dashboard/categories/new">
            <Plus className="mr-2 h-5 w-5" />
            New Category
          </Link>
        </Button>
      </div>

      {/* Categories Content */}

{categories.length === 0 ? (
  <div className="flex min-h-[500px] flex-col items-center justify-center rounded-3xl border border-dashed bg-card px-6 text-center">
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
      <FolderTree className="h-10 w-10 text-primary" />
    </div>

    <h2 className="mt-6 text-2xl font-bold">
      No Categories Found
    </h2>

    <p className="mt-2 max-w-md text-muted-foreground">
      Create your first category to organize products and
      improve navigation across your store.
    </p>

    <Button
      asChild
      size="lg"
      className="mt-8"
    >
      <Link href="/admin/dashboard/categories/new">
        <Plus className="mr-2 h-5 w-5" />
        Create Category
      </Link>
    </Button>
  </div>
) : (
  <CategoriesClient
  categories={categories}
/>
)}

    </div>
  );
}