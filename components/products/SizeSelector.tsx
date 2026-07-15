"use client";

import { useState } from "react";

interface SizeSelectorProps {
  sizes: string[];
}

export default function SizeSelector({
  sizes,
}: SizeSelectorProps) {
  const [selectedSize, setSelectedSize] = useState(sizes[1] ?? sizes[0]);

  return (
    <div className="mt-10">
      <h3 className="mb-4 text-lg font-semibold text-white">
        Select Size
      </h3>

      <div className="flex flex-wrap gap-3">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => setSelectedSize(size)}
            className={`h-12 w-12 rounded-xl border text-sm font-semibold transition-all duration-200 ${
              selectedSize === size
                ? "border-purple-500 bg-purple-600 text-white"
                : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-purple-500"
            }`}
          >
            {size}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-zinc-400">
        Selected Size:
        <span className="ml-2 font-semibold text-purple-400">
          {selectedSize}
        </span>
      </p>
    </div>
  );
}