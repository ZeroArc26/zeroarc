import Link from "next/link";
import { FolderTree, Plus } from "lucide-react";

import PageHeader from "@/components/admin/shared/PageHeader";
import { Button } from "@/components/ui/button";

import { getCategories } from "@/lib/actions/categories/getCategories";
import CategoriesClient from "@/components/admin/categories/CategoriesClient";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Categories"
        description="Organize and manage product categories for your store."
        action={
          <Link href="/admin/dashboard/categories/new">
            <Button className="gap-2 rounded-xl bg-violet-600 hover:bg-violet-700">
              <Plus className="h-4 w-4" />
              New Category
            </Button>
          </Link>
        }
      />

      {categories.length === 0 ? (
        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/40 px-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-500/10">
            <FolderTree className="h-10 w-10 text-violet-400" />
          </div>

          <h2 className="mt-6 text-2xl font-bold text-white">
            No Categories Found
          </h2>

          <p className="mt-2 max-w-md text-zinc-400">
            Create your first category to organize products and improve
            navigation across your store.
          </p>

          <Link href="/admin/dashboard/categories/new">
            <Button className="mt-8 gap-2 rounded-xl bg-violet-600 hover:bg-violet-700">
              <Plus className="h-4 w-4" />
              Create Category
            </Button>
          </Link>
        </div>
      ) : (
        <CategoriesClient categories={categories} />
      )}
    </div>
  );
}