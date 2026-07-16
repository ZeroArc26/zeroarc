"use client";

import { useMemo, useState } from "react";

import { Product } from "@/types/product";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";

import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";

import SizeSelector from "./SizeSelector";
import ColorSelector from "./ColorSelector";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({
  product,
}: ProductInfoProps) {
  const [selectedColor, setSelectedColor] = useState(
    product.variants[0]?.color ?? ""
  );

  const selectedVariant = useMemo(() => {
    return (
      product.variants.find(
        (variant) => variant.color === selectedColor
      ) ?? product.variants[0]
    );
  }, [product.variants, selectedColor]);

  const [selectedSize, setSelectedSize] = useState(
  product.sizes[0] ?? ""
);

const addToCart = useCartStore(
  (state) => state.addToCart
);

const addToWishlist = useWishlistStore(
  (state) => state.addToWishlist
);

const removeFromWishlist = useWishlistStore(
  (state) => state.removeFromWishlist
);

const isInWishlist = useWishlistStore((state) =>
  state.isInWishlist(product.id)
);

  return (
    <div>
      <p className="text-sm uppercase tracking-[0.3em] text-purple-400">
        {product.collection}
      </p>

      <h1 className="mt-3 text-5xl font-black">
        {product.name}
      </h1>

      <div className="mt-4 flex items-center gap-3">
        <span className="text-3xl font-bold text-purple-400">
          ₹{product.price}
        </span>

        {product.originalPrice && (
          <span className="text-xl text-zinc-500 line-through">
            ₹{product.originalPrice}
          </span>
        )}
      </div>

      <p className="mt-6 leading-8 text-zinc-400">
        {product.description}
      </p>

      <SizeSelector
  sizes={product.sizes}
  selectedSize={selectedSize}
  onSizeChange={setSelectedSize}
/>

      <ColorSelector
        variants={product.variants}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
      />

      <div className="mt-10">
        <h3 className="mb-4 text-lg font-semibold">
          Features
        </h3>

        <ul className="space-y-3 text-zinc-300">
          {product.features.map((feature) => (
            <li key={feature}>• {feature}</li>
          ))}
        </ul>
      </div>

      <div className="mt-10 rounded-2xl border border-zinc-800 p-6">
        <div className="flex justify-between">
          <span className="text-zinc-400">Fabric</span>

          <span>{product.fabric}</span>
        </div>

        <div className="mt-4 flex justify-between">
          <span className="text-zinc-400">Fit</span>

          <span>{product.fit}</span>
        </div>

        <div className="mt-4 flex justify-between">
          <span className="text-zinc-400">Stock</span>

          <span>{selectedVariant?.stock ?? 0}</span>
        </div>

        <div className="mt-4 flex justify-between">
          <span className="text-zinc-400">SKU</span>

          <span>{selectedVariant?.sku}</span>
        </div>
      </div>

      <div className="mt-10 flex gap-4">
        <PrimaryButton
  onClick={() => {
    if (!selectedVariant) return;

    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,

      variantId: selectedVariant.id,
      sku: selectedVariant.sku,
      color: selectedVariant.color,
      size: selectedSize,

      image: selectedVariant.image,

      price: product.price,
      quantity: 1,

      availableStock: selectedVariant.stock,

      addedAt: new Date().toISOString(),
    });

    alert("Product Added Successfully!");
  }}
>
  Add to Cart
</PrimaryButton>

        <SecondaryButton
  onClick={() => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
      alert("Removed from Wishlist!");
      return;
    }

    if (!selectedVariant) return;

    addToWishlist({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: selectedVariant.image,
      price: product.price,
    });

    alert("Added to Wishlist!");
  }}
>
  {isInWishlist
    ? "❤️ Remove Wishlist"
    : "🤍 Add Wishlist"}
</SecondaryButton>
      </div>
    </div>
  );
}