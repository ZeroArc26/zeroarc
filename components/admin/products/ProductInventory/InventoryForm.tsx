"use client";

import {
  Package,
  Copy,
  RefreshCw,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { InventoryFormProps } from "./types";

export default function InventoryForm({
  sku,
  barcode,
  stockQuantity,
  lowStockAlert,
  reorderLevel,
  trackInventory,
  continueSelling,
  setStockQuantity,
  setLowStockAlert,
  setReorderLevel,
}: InventoryFormProps) {
  return (
    <Card className="overflow-hidden rounded-3xl border border-white/10 bg-[#111113] shadow-xl">

      <CardHeader className="border-b border-white/10">

        <div className="flex items-start justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">

              <Package className="h-7 w-7 text-violet-400" />

            </div>

            <div>

              <CardTitle className="text-2xl font-bold text-white">
                Product Inventory
              </CardTitle>

              <CardDescription className="mt-1">
                Manage stock, SKU and inventory settings.
              </CardDescription>

            </div>

          </div>

          <Badge className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-emerald-400">
            ● Auto Saved
          </Badge>

        </div>

      </CardHeader>

      <CardContent className="space-y-8 p-8">

        {/* SKU */}

        <div className="space-y-3">

          <Label className="text-white">
            SKU
          </Label>

          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#18181b] p-4">

            <span className="font-mono text-white">
              {sku}
            </span>

            <div className="flex gap-2">

              <Button
                variant="outline"
                size="icon"
                className="rounded-xl"
              >
                <Copy className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="rounded-xl"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>

            </div>

          </div>

        </div>

        {/* Barcode */}

        <div className="space-y-3">

          <Label className="text-white">
            Barcode
          </Label>

          <div className="rounded-2xl border border-white/10 bg-[#18181b] p-5">

            <div className="flex items-center justify-between">

              <div>

                <div className="font-mono text-white">
                  {barcode}
                </div>

                <div className="mt-3 h-10 rounded bg-white/5" />
              </div>

              <div className="flex gap-2">

                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl"
                >
                  <Copy className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>

              </div>

            </div>

          </div>

        </div>
                {/* Stock Quantity */}

        <div className="space-y-3">

          <Label className="text-white">
            Stock Quantity
          </Label>

          <div className="flex items-center gap-3">

            <Button
              type="button"
              variant="outline"
              className="h-12 w-12 rounded-2xl border-white/10"
              onClick={() =>
                setStockQuantity((prev) => Math.max(prev - 1, 0))
              }
            >
              −
            </Button>

            <Input
              type="number"
              value={stockQuantity}
              onChange={(e) =>
                setStockQuantity(Number(e.target.value))
              }
              className="h-12 rounded-2xl border-white/10 bg-[#18181b] text-center text-lg font-semibold"
            />

            <Button
              type="button"
              variant="outline"
              className="h-12 w-12 rounded-2xl border-white/10"
              onClick={() =>
                setStockQuantity((prev) => prev + 1)
              }
            >
              +
            </Button>

          </div>

        </div>

        {/* Low Stock Alert */}

        <div className="space-y-3">

          <Label className="text-white">
            Low Stock Alert
          </Label>

          <Input
            type="number"
            value={lowStockAlert}
            onChange={(e) =>
              setLowStockAlert(Number(e.target.value))
            }
            className="h-12 rounded-2xl border-white/10 bg-[#18181b]"
          />

        </div>

        {/* Reorder Level */}

        <div className="space-y-3">

          <Label className="text-white">
            Reorder Level
          </Label>

          <Input
            type="number"
            value={reorderLevel}
            onChange={(e) =>
              setReorderLevel(Number(e.target.value))
            }
            className="h-12 rounded-2xl border-white/10 bg-[#18181b]"
          />

        </div>

        {/* Inventory Settings */}

        <div className="space-y-4 rounded-2xl border border-white/10 bg-[#18181b] p-5">

          <div className="flex items-center justify-between">

            <div>

              <h4 className="font-medium text-white">
                Track Inventory
              </h4>

              <p className="text-sm text-zinc-500">
                Enable stock tracking for this product.
              </p>

            </div>

            <Button
              type="button"
              variant={trackInventory ? "default" : "outline"}
            >
              {trackInventory ? "Enabled" : "Disabled"}
            </Button>

          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-4">

            <div>

              <h4 className="font-medium text-white">
                Continue Selling
              </h4>

              <p className="text-sm text-zinc-500">
                Allow orders even when stock reaches zero.
              </p>

            </div>

            <Button
              type="button"
              variant={continueSelling ? "default" : "outline"}
            >
              {continueSelling ? "Enabled" : "Disabled"}
            </Button>

          </div>

        </div>

        {/* Footer */}

        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 px-5 py-4">

          <p className="text-sm text-violet-300">
            ✨ Inventory changes are saved automatically and reflected across your store.
          </p>

        </div>

      </CardContent>

    </Card>
  );
}