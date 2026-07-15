"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductVariant } from "@/types/product";

interface ProductGalleryProps {
  variants: ProductVariant[];
}

export default function ProductGallery({
  variants,
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(
    variants[0]?.image || "/images/products/placeholder.png"
  );

  return (
    <div>
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">
        <Image
          src={selectedImage}
          alt="Product"
          fill
          priority
          className="object-contain p-10 transition duration-300 hover:scale-105"
        />
      </div>

      {/* Thumbnails */}
      <div className="mt-5 flex gap-4 overflow-x-auto">
        {variants.map((variant) => (
          <button
            key={variant.id}
            onClick={() => setSelectedImage(variant.image)}
            className={`relative h-24 w-24 overflow-hidden rounded-xl border transition ${
              selectedImage === variant.image
                ? "border-purple-500"
                : "border-zinc-700"
            }`}
          >
            <Image
              src={variant.image}
              alt={variant.color}
              fill
              className="object-contain p-2"
            />
          </button>
        ))}
      </div>
    </div>
  );
}