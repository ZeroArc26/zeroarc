"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

export default function ProductVariants() {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur">
      <h2 className="text-xl font-bold text-white">
        Product Variants
      </h2>

      <p className="mt-1 text-sm text-zinc-400">
        Add colors, sizes and other product options.
      </p>

      {/* Colors */}

      <div className="mt-6">
        <Label>Colors</Label>

        <div className="mt-3 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-zinc-700 px-3 py-2">
            <span>Black</span>

            <button type="button">
              <X size={16} />
            </button>
          </div>

          <Button
            type="button"
            variant="outline"
          >
            <Plus size={16} className="mr-2" />
            Add Color
          </Button>
        </div>
      </div>

      {/* Sizes */}

      <div className="mt-8">
        <Label>Sizes</Label>

        <div className="mt-3 flex flex-wrap gap-3">
          {["S", "M", "L", "XL"].map((size) => (
            <div
              key={size}
              className="rounded-xl border border-zinc-700 px-4 py-2"
            >
              {size}
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}

      <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
        <h3 className="font-semibold text-white">
          Variant Preview
        </h3>

        <div className="mt-5 space-y-4">

          <div className="grid grid-cols-4 gap-4">
            <Input value="Black / M" readOnly />

            <Input
              type="number"
              placeholder="Price"
            />

            <Input
              type="number"
              placeholder="Stock"
            />

            <Input
              placeholder="SKU"
            />
          </div>

        </div>
      </div>
    </div>
  );
}