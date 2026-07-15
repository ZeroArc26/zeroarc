"use client";

import { ProductVariant } from "@/types/product";

interface ColorSelectorProps {
  variants: ProductVariant[];
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export default function ColorSelector({
  variants,
  selectedColor,
  onColorChange,
}: ColorSelectorProps) {
  return (
    <div className="mt-8">
      <h3 className="mb-4 text-lg font-semibold text-white">
        Select Color
      </h3>

      <div className="flex flex-wrap gap-3">
        {variants.map((variant) => (
          <button
            key={variant.id}
            type="button"
            onClick={() => onColorChange(variant.color)}
            className={`rounded-xl border px-5 py-3 text-sm font-medium transition ${
              selectedColor === variant.color
                ? "border-purple-500 bg-purple-600 text-white"
                : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-purple-500"
            }`}
          >
            {variant.color}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-zinc-400">
        Selected Color:
        <span className="ml-2 font-semibold text-purple-400">
          {selectedColor}
        </span>
      </p>
    </div>
  );
}