"use client";

import { useState } from "react";

import ProductGallery from "@/components/products/ProductGallery";
import ProductFeatures from "@/components/products/ProductFeatures";
import ProductInfo from "@/components/products/ProductInfo";
import Reveal from "@/components/motion/Reveal";

interface ProductGalleryAndInfoProps {
  product: any;
  recentPurchaseCount?: number;
  lowestPriceLast30Days?: number | null;
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
  recentPurchaseCount,
  lowestPriceLast30Days,
}: ProductGalleryAndInfoProps) {
  const [selectedColor, setSelectedColor] = useState(
    product.variants?.[0]?.color ?? ""
  );

  return (
    <>
      <Reveal trigger="mount" className="sticky top-20">
        <ProductGallery images={product.images} selectedColor={selectedColor} />
        <ProductFeatures />
      </Reveal>

      <Reveal trigger="mount" delay={0.1}>
        <ProductInfo
          product={product}
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
          recentPurchaseCount={recentPurchaseCount}
          lowestPriceLast30Days={lowestPriceLast30Days}
        />
      </Reveal>
    </>
  );
}
