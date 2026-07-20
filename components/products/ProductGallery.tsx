"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({
  images,
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(
    images?.[0] || "/images/products/placeholder.png"
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

        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(image)}
            className={`relative h-24 w-24 overflow-hidden rounded-xl border transition ${
              selectedImage === image
                ? "border-purple-500"
                : "border-zinc-700"
            }`}
          >
            <Image
              src={image}
              alt={`Product ${index + 1}`}
              fill
              className="object-contain p-2"
            />
          </button>
        ))}

      </div>

    </div>
  );
}