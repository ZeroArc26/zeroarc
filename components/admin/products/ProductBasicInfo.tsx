"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProductBasicInfo() {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">
          Basic Information
        </h2>

        <p className="mt-1 text-sm text-zinc-400">
          Enter the essential details about your product.
        </p>
      </div>

      <div className="space-y-6">
        {/* Product Name */}
        <div className="space-y-2">
          <Label htmlFor="productName" className="text-zinc-200">
            Product Name
          </Label>

          <Input
            id="productName"
            placeholder="ZeroArc Oversized Tee"
            className="h-11 border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
          />
        </div>

        {/* Product Slug */}
        <div className="space-y-2">
          <Label htmlFor="slug" className="text-zinc-200">
            Product Slug
          </Label>

          <Input
            id="slug"
            placeholder="zeroarc-oversized-tee"
            className="h-11 border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
          />

          <p className="text-xs text-zinc-500">
            Used for the product URL. Example:
            <span className="ml-1 text-violet-400">
              /products/zeroarc-oversized-tee
            </span>
          </p>
        </div>

        {/* Short Description */}
        <div className="space-y-2">
          <Label htmlFor="shortDescription" className="text-zinc-200">
            Short Description
          </Label>

          <textarea
            id="shortDescription"
            rows={3}
            placeholder="Write a short description..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white placeholder:text-zinc-500 outline-none transition focus:border-violet-500"
          />

          <p className="text-xs text-zinc-500">
            This appears in product cards and search results.
          </p>
        </div>

        {/* Full Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-zinc-200">
            Full Description
          </Label>

          <textarea
            id="description"
            rows={8}
            placeholder="Write the complete product description..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white placeholder:text-zinc-500 outline-none transition focus:border-violet-500"
          />

          <p className="text-xs text-zinc-500">
            Include product details, material, fit, wash care, etc.
          </p>
        </div>
      </div>
    </div>
  );
}