"use client";

import { useRouter } from "next/navigation";
import { Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { deleteCategory } from "@/lib/actions/categories/deleteCategory";

interface CategoryActionsProps {
  id: string;
}

export default function CategoryActions({
  id,
}: CategoryActionsProps) {
    console.log("EDIT ID:", id);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {

  const confirmDelete = confirm(
    "Are you sure you want to delete this category?"
  );

  if (!confirmDelete) return;

  try {

    setLoading(true);

    await deleteCategory(id);

    toast.success(
      "Category deleted successfully"
    );

    router.refresh();

  } catch (error) {

    toast.error(
      error instanceof Error
        ? error.message
        : "Delete failed"
    );

  } finally {

    setLoading(false);

  }
}

  return (
    <div className="flex gap-2">

      <Button
  asChild
  size="sm"
  variant="outline"
>
  <a href={`/admin/dashboard/categories/${id}/edit`}>
    <Pencil className="mr-2 h-4 w-4" />
    Edit
  </a>
</Button>


      <Button
  size="sm"
  variant="destructive"
  onClick={handleDelete}
  disabled={loading}
>
  <Trash2 className="mr-2 h-4 w-4" />
  {loading ? "Deleting..." : "Delete"}
</Button>

    </div>
  );
}