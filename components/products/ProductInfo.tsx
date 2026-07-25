"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";

import SizeSelector from "./SizeSelector";
import ColorSelector from "./ColorSelector";

import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";

interface ProductInfoProps {
  product: {
    _id: string;

    title: string;
    slug: string;

    description: string;

    price: number;
    comparePrice?: number;

    category: string;
    collectionName: string;

    images: string[];

    colors: string[];

    sizes: string[];

    stock: number;
  };
}

export default function ProductInfo({
  product,
}: ProductInfoProps) {
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0] ?? ""
  );

  const [selectedSize, setSelectedSize] = useState(
    product.sizes[0] ?? ""
  );

  const [quantity, setQuantity] = useState(1);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    state.isInWishlist(product._id)
  );

  return (
    <div>

      <p className="text-sm uppercase tracking-[0.3em] text-purple-400">
        {product.collectionName}
      </p>

      <h1 className="mt-3 text-5xl font-black">
        {product.title}
      </h1>

      <div className="mt-4 flex items-center gap-3">

        <span className="text-3xl font-bold text-purple-400">
          ₹{product.price}
        </span>

        {product.comparePrice && (
          <span className="text-xl text-zinc-500 line-through">
            ₹{product.comparePrice}
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
        colors={product.colors}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
      />

            <div className="mt-10 rounded-2xl border border-zinc-800 p-6">

        <div className="flex justify-between">
          <span className="text-zinc-400">
            Category
          </span>

          <span>
            {product.category}
          </span>
        </div>

        <div className="mt-4 flex justify-between">
          <span className="text-zinc-400">
            Collection
          </span>

          <span>
            {product.collectionName}
          </span>
        </div>

        <div className="mt-4 flex justify-between">
          <span className="text-zinc-400">
            Available Stock
          </span>

          <span className="font-semibold">
            {product.stock}
          </span>
        </div>

      </div>

      <div className="mt-8">

        <h3 className="mb-3 text-lg font-semibold">
          Quantity
        </h3>

        <div className="flex w-fit items-center rounded-xl border border-zinc-800">

          <button
            onClick={() =>
              setQuantity((prev) =>
                Math.max(1, prev - 1)
              )
            }
            className="px-5 py-3 text-xl transition hover:bg-zinc-800"
          >
            −
          </button>

          <span className="w-14 text-center font-bold">
            {quantity}
          </span>

          <button
            onClick={() =>
              setQuantity((prev) =>
                Math.min(product.stock, prev + 1)
              )
            }
            className="px-5 py-3 text-xl transition hover:bg-zinc-800"
          >
            +
          </button>

        </div>

      </div>

      <div className="mt-10">

        <h3 className="mb-4 text-lg font-semibold">
          Product Details
        </h3>

        <ul className="space-y-3 text-zinc-400">

          <li>
            • Premium 240 GSM Cotton
          </li>

          <li>
            • Oversized Fit
          </li>

          <li>
            • High Quality Print
          </li>

          <li>
            • Soft & Breathable Fabric
          </li>

          <li>
            • Made for Daily Wear
          </li>

        </ul>

      </div>

            <div className="mt-10 flex gap-4">

        <PrimaryButton
          onClick={() => {
            addToCart({
              productId: product._id,

              slug: product.slug,

              title: product.title,

              image: product.images[0],

              color: selectedColor,

              size: selectedSize,

              price: product.price,

              quantity,

              stock: product.stock,

              addedAt: new Date().toISOString(),
            });

            toast.success("Added to Cart 🛒");
          }}
        >
          Add to Cart
        </PrimaryButton>

        <SecondaryButton
          onClick={() => {
            if (isInWishlist) {
              removeFromWishlist(product._id);

              toast.success("Removed from Wishlist ❤️");

              return;
            }

            addToWishlist({
              productId: product._id,

              slug: product.slug,

              title: product.title,

              image: product.images[0],

              color: selectedColor,

              size: selectedSize,

              price: product.price,

              stock: product.stock,
            });

            toast.success("Added to Wishlist ❤️");
          }}
        >
          {!mounted
            ? "🤍 Wishlist"
            : isInWishlist
            ? "❤️ Remove Wishlist"
            : "🤍 Wishlist"}
        </SecondaryButton>

      </div>

    </div>
  );
}