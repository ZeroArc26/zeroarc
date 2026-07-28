"use client";

import { useFormContext } from "react-hook-form";

import {
  Package,
  Copy,
  Check,
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

export default function InventoryForm() {
  const {
    register,
    watch,
    setValue,
  } = useFormContext();

  const copyToClipboard = async (text: string) => {
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    console.log("Copied:", text);
  } catch (error) {
    console.error(error);
  }
};

  const sku = watch("inventory.sku");
  const barcode = watch("inventory.barcode");

  const stockQuantity = watch("inventory.quantity");

  const lowStockAlert = watch(
    "inventory.lowStockThreshold"
  );

  const reorderLevel = watch(
    "inventory.reorderLevel"
  );

  const trackInventory = watch(
    "inventory.trackInventory"
  );

  const continueSelling = watch(
    "inventory.allowBackorders"
  );

  const generateSKU = () => {
    const random = Math.floor(
      100000 + Math.random() * 900000
    );

    setValue(
      "inventory.sku",
      `ZA-${random}`,
      {
        shouldDirty: true,
        shouldValidate: true,
      }
    );
  };

  const generateBarcode = () => {
    const code = Math.floor(
      1000000000000 +
        Math.random() * 9000000000000
    ).toString();

    setValue(
      "inventory.barcode",
      code,
      {
        shouldDirty: true,
        shouldValidate: true,
      }
    );
  };

  const copyText = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (err) {
      console.error(err);
    }
  };

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
            ● Connected
          </Badge>

        </div>
      </CardHeader>

      <CardContent className="space-y-8 p-8">

                {/* ================= SKU ================= */}

        <div className="space-y-3">

          <Label className="text-white">
            SKU
          </Label>

          <div className="flex gap-2">

            <Input
              {...register("inventory.sku")}
              placeholder="ZA-000001"
              className="h-12 rounded-2xl border-white/10 bg-[#18181b]"
            />

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-xl"
              onClick={() => copyText(sku || "")}
            >
              <Copy className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-xl"
              onClick={generateSKU}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>

          </div>

          <p className="text-xs text-zinc-500">
            Unique Stock Keeping Unit used for inventory tracking.
          </p>

        </div>



        {/* ================= Barcode ================= */}

        <div className="space-y-3">

          <Label className="text-white">
            Barcode
          </Label>

          <div className="flex gap-2">

            <Input
              {...register("inventory.barcode")}
              placeholder="8901234567891"
              className="h-12 rounded-2xl border-white/10 bg-[#18181b] font-mono"
            />

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-xl"
              onClick={() => copyText(barcode || "")}
            >
              <Copy className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-xl"
              onClick={generateBarcode}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>

          </div>

          <div className="rounded-xl border border-white/10 bg-[#18181b] p-4">

            <div className="font-mono text-center tracking-[4px] text-white">
              {barcode || "8901234567891"}
            </div>

            <div className="mt-4 flex h-10 items-end justify-center gap-[2px]">

              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-sm bg-white ${
                    i % 2 === 0
                      ? "h-10 w-[2px]"
                      : "h-7 w-[1.5px]"
                  }`}
                />
              ))}

            </div>

          </div>

          <p className="text-xs text-zinc-500">
            Scan-ready barcode used for warehouse and POS systems.
          </p>

        </div>

                {/* ================= Stock Quantity ================= */}

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
                setValue(
                  "inventory.quantity",
                  Math.max((stockQuantity || 0) - 1, 0),
                  {
                    shouldDirty: true,
                    shouldValidate: true,
                  }
                )
              }
            >
              −
            </Button>

            <Input
              type="number"
              {...register("inventory.quantity", {
                valueAsNumber: true,
              })}
              className="h-12 rounded-2xl border-white/10 bg-[#18181b] text-center text-lg font-semibold"
            />

            <Button
              type="button"
              variant="outline"
              className="h-12 w-12 rounded-2xl border-white/10"
              onClick={() =>
                setValue(
                  "inventory.quantity",
                  (stockQuantity || 0) + 1,
                  {
                    shouldDirty: true,
                    shouldValidate: true,
                  }
                )
              }
            >
              +
            </Button>

          </div>

          <p className="text-xs text-zinc-500">
            Current available stock for this product.
          </p>

        </div>





        {/* ================= Low Stock Alert ================= */}

        <div className="space-y-3">

          <Label className="text-white">
            Low Stock Alert
          </Label>

          <Input
            type="number"
            {...register(
              "inventory.lowStockThreshold",
              {
                valueAsNumber: true,
              }
            )}
            className="h-12 rounded-2xl border-white/10 bg-[#18181b]"
          />

          <p className="text-xs text-zinc-500">
            Receive an alert when stock falls below this quantity.
          </p>

        </div>





        {/* ================= Reorder Level ================= */}

        <div className="space-y-3">

          <Label className="text-white">
            Reorder Level
          </Label>

          <Input
            type="number"
            {...register(
              "inventory.reorderLevel",
              {
                valueAsNumber: true,
              }
            )}
            className="h-12 rounded-2xl border-white/10 bg-[#18181b]"
          />

          <p className="text-xs text-zinc-500">
            Recommended stock level before placing a new supplier order.
          </p>

        </div>

                {/* ================= Inventory Settings ================= */}

        <div className="space-y-4 rounded-2xl border border-white/10 bg-[#18181b] p-5">

          {/* Track Inventory */}

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
              onClick={() =>
                setValue(
                  "inventory.trackInventory",
                  !trackInventory,
                  {
                    shouldDirty: true,
                    shouldValidate: true,
                  }
                )
              }
            >
              {trackInventory ? "Enabled" : "Disabled"}
            </Button>

          </div>



          {/* Continue Selling */}

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
              onClick={() =>
                setValue(
                  "inventory.allowBackorders",
                  !continueSelling,
                  {
                    shouldDirty: true,
                    shouldValidate: true,
                  }
                )
              }
            >
              {continueSelling ? "Enabled" : "Disabled"}
            </Button>

          </div>

        </div>



        {/* ================= Footer ================= */}

        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 px-5 py-4">

          <p className="text-sm text-violet-300">
            ✨ Inventory changes are synced with your product form and will
            be saved to MongoDB when you publish or save the product.
          </p>

        </div>

      </CardContent>

    </Card>
  );
}