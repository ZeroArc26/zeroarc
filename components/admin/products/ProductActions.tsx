"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Copy,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import DeleteProductDialog from "./DeleteProductDialog";

interface ProductActionsProps {
  productId: string;
  productName?: string;
}

export default function ProductActions({
  productId,
  productName = "this product",
}: ProductActionsProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `/api/products/${productId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      setOpen(false);

      router.refresh();
    } catch (error) {
      console.error("Delete Product Error:", error);

      alert("Failed to delete product.");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 rounded-lg hover:bg-zinc-800"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-52 border-zinc-800 bg-zinc-900 text-white"
        >
          <DropdownMenuItem asChild>
            <Link
              href={`/admin/dashboard/products/${productId}`}
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Product
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href={`/admin/dashboard/products/${productId}/edit`}
              className="cursor-pointer"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Product
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer">
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="cursor-pointer text-red-500 focus:text-red-500"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Product
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteProductDialog
        open={open}
        onOpenChange={setOpen}
        productName={productName}
        onDelete={handleDelete}
      />
    </>
  );
}