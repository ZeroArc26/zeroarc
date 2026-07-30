"use client";

import { useState } from "react";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import InventoryForm from "../forms/InventoryForm";
import { createInventory } from "@/lib/actions/inventory/createInventory";
import { useRouter } from "next/navigation";

export default function AddInventoryDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Inventory
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Inventory</DialogTitle>
        </DialogHeader>

        <div className="py-6">
          <InventoryForm
  mode="create"
  isSubmitting={isSubmitting}
  onCancel={() => setOpen(false)}
  onSubmit={async (values) => {
    try {
      setIsSubmitting(true);

      const result = await createInventory({
  productId: values.productId,
  warehouse: values.warehouse,
  variants: [
    {
      variantId: values.variantId,
      sku: values.sku,
      availableStock: values.availableStock,
      reservedStock: values.reservedStock,
      incomingStock: values.incomingStock,
      lowStockThreshold: values.lowStockThreshold,
    },
  ],
});

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