"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, Search } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { searchProductVariants } from "@/lib/actions/inventory/searchProductVariants";
import { adjustVariantStock } from "@/lib/actions/inventory/adjustVariantStock";

interface Result {
  productId: string;
  productTitle: string;
  productImage: string;
  variantId: string;
  sku: string;
  color: string;
  size: string;
  stock: number;
  lowStockThreshold: number;
}

export default function StockAdjustmentDialog() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [selected, setSelected] = useState<Result | null>(null);
  const [stock, setStock] = useState(0);
  const [threshold, setThreshold] = useState(5);
  const [saving, setSaving] = useState(false);

  async function handleSearch(value: string) {
    setQuery(value);
    setSelected(null);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    setSearching(true);
    try {
      const res = await searchProductVariants(value);
      setResults(res.results || []);
    } finally {
      setSearching(false);
    }
  }

  function selectResult(r: Result) {
    setSelected(r);
    setStock(r.stock);
    setThreshold(r.lowStockThreshold);
  }

  async function handleSave() {
    if (!selected) return;

    setSaving(true);
    try {
      const result = await adjustVariantStock({
        productId: selected.productId,
        variantId: selected.variantId,
        stock,
        lowStockThreshold: threshold,
      });

      if (!result.success) {
        alert(result.message);
        return;
      }

      setOpen(false);
      setQuery("");
      setResults([]);
      setSelected(null);
      router.refresh();
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
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Stock Adjustment
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Stock Adjustment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search product name or SKU..."
              className="pl-9"
            />
          </div>

          {searching && (
            <p className="text-sm text-muted-foreground">Searching...</p>
          )}

          {!selected && results.length > 0 && (
            <div className="max-h-56 space-y-1 overflow-y-auto rounded-lg border p-1">
              {results.map((r) => (
                <button
                  key={`${r.productId}-${r.variantId}`}
                  onClick={() => selectResult(r)}
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
                >
                  <span>
                    {r.productTitle} — {r.color}/{r.size}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Stock: {r.stock}
                  </span>
                </button>
              ))}
            </div>
          )}

          {selected && (
            <div className="space-y-4 rounded-lg border p-4">
              <p className="text-sm font-medium">
                {selected.productTitle} — {selected.color}/{selected.size}
              </p>
              <p className="text-xs text-muted-foreground">SKU: {selected.sku}</p>

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
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!selected || saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}