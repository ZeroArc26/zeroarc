"use client";

import { ImagePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductImages() {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur">
      <h2 className="text-xl font-bold text-white">
        Product Images
      </h2>

      <p className="mt-1 text-sm text-zinc-400">
        Upload high-quality images for your product.
      </p>

      <label
        htmlFor="images"
        className="mt-6 flex h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-700 transition hover:border-violet-500"
      >
        <ImagePlus className="h-12 w-12 text-violet-400" />

        <p className="mt-4 text-lg font-semibold text-white">
          Drag & Drop Images
        </p>

        <p className="mt-1 text-sm text-zinc-400">
          or click to browse
        </p>

        <input
          id="images"
          type="file"
          multiple
          className="hidden"
        />
      </label>

      {/* Preview Placeholder */}

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">

        <div className="relative aspect-square rounded-2xl border border-zinc-800 bg-zinc-950">

          <button
            className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white"
            type="button"
          >
            <Trash2 size={14} />
          </button>

        </div>

      </div>

      <Button className="mt-6 w-full">
        Upload Images
      </Button>

    </div>
  );
}