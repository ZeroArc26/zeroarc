"use client";

import { useState } from "react";
import { Pencil, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { adjustVariantStock } from "@/lib/actions/inventory/adjustVariantStock";
import type { VariantInventoryRow } from "@/lib/actions/inventory/getProductVariantInventory";

interface Props {
  row: VariantInventoryRow;
}

export default function EditVariantStockDialog({ row }: Props) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stock, setStock] = useState(row.stock);
  const [threshold, setThreshold] = useState(row.lowStockThreshold);

  async function handleSave() {
    setSaving(true);
    try {
      const result = await adjustVariantStock({
        productId: row.productId,
        variantId: row.variantId,
        stock,
        lowStockThreshold: threshold,
      });

      if (!result.success) {
        alert(result.message);
        return;
      }

      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust Stock — {row.productTitle}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            {row.color} • {row.size} • SKU: {row.sku}
          </p>

          <div className="space-y-2">
            <Label>Stock Quantity</Label>
            <Input
              type="number"
              min={0}
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Low Stock Threshold</Label>
            <Input
              type="number"
              min={0}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}