"use client";

import { useState } from "react";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { deleteInventory } from "@/lib/actions/inventory/deleteInventory";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import type { InventoryDocument } from "@/lib/types/inventory";

interface DeleteInventoryDialogProps {
  inventory: InventoryDocument;
}

export default function DeleteInventoryDialog({
  inventory,
}: DeleteInventoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

const router = useRouter();

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete Inventory?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone. This inventory record will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
  onClick={async (e) => {
    e.preventDefault();

    try {
      setIsDeleting(true);

      const result = await deleteInventory(
        inventory._id
      );

      if (!result.success) {
        throw new Error(result.message);
      }

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  }}
  disabled={isDeleting}
>
  {isDeleting ? "Deleting..." : "Delete"}
</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}