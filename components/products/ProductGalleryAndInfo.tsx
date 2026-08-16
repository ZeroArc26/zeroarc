"use client";

import { useState } from "react";

import ProductGallery from "@/components/products/ProductGallery";
import ProductFeatures from "@/components/products/ProductFeatures";
import ProductInfo from "@/components/products/ProductInfo";

interface ProductGalleryAndInfoProps {
  product: any;
}

/**
 * ProductGallery and ProductInfo are laid out side by side, but the
 * gallery needs to know which color is selected (so it can show only
 * that color's images) — this wrapper is the shared parent that holds
 * that one piece of state, so a color pick in ProductInfo is reflected
 * in the gallery immediately.
 */
export default function ProductGalleryAndInfo({
  product,
}: ProductGalleryAndInfoProps) {
  const [selectedColor, setSelectedColor] = useState(
    product.variants?.[0]?.color ?? ""
  );

  return (
    <>
      <div>
        <ProductGallery images={product.images} selectedColor={selectedColor} />
        <ProductFeatures />
      </div>

      <ProductInfo
        product={product}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
      />
    </>
  );
}
