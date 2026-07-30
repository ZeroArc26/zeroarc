"use client";

import { useState } from "react";

import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import type { InventoryDocument } from "@/lib/types/inventory";

import InventoryForm from "../forms/InventoryForm";
import { updateInventory } from "@/lib/actions/inventory/updateInventory";
import { useRouter } from "next/navigation";

interface EditInventoryDialogProps {
  inventory: InventoryDocument;
}

export default function EditInventoryDialog({
  inventory,
}: EditInventoryDialogProps) {
  const [open, setOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Inventory</DialogTitle>
        </DialogHeader>

        <div className="py-6">
          <InventoryForm
  mode="edit"
  isSubmitting={isSubmitting}
  defaultValues={{
    productId: inventory.productId,
    variantId: inventory.variants[0]?.variantId ?? "",
    warehouse: inventory.warehouse,
    sku: inventory.variants[0]?.sku ?? "",
    availableStock:
      inventory.variants[0]?.availableStock ?? 0,
    reservedStock:
      inventory.variants[0]?.reservedStock ?? 0,
    incomingStock:
      inventory.variants[0]?.incomingStock ?? 0,
    lowStockThreshold:
      inventory.variants[0]?.lowStockThreshold ?? 5,
  }}
  onCancel={() => setOpen(false)}
  onSubmit={async (values) => {
    try {
      setIsSubmitting(true);

      const result = await updateInventory(
        inventory._id,
        {
          productId: values.productId,
          warehouse: values.warehouse,
          variants: [
            {
              variantId: values.variantId,
              sku: values.sku,
              availableStock:
                values.availableStock,
              reservedStock:
                values.reservedStock,
              incomingStock:
                values.incomingStock,
              lowStockThreshold:
                values.lowStockThreshold,
            },
          ],
        }
      );

      if (!result.success) {
        throw new Error(result.message);
      }

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }}
/>
        </div>
      </DialogContent>
    </Dialog>
  );
}