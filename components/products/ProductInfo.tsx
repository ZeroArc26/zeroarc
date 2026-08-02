"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Star, ShoppingBag, Heart, Truck, ChevronRight } from "lucide-react";

import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";

interface Variant {
  id: string;
  color: string;
  colorHex?: string;
  size: string;
  sku: string;
  price: number;
  stock: number;
  image?: string;
  isActive?: boolean;
}

interface ProductInfoProps {
  product: {
    _id: string;
    basicInfo: {
      title: string;
      slug: string;
      description: string;
      brand: string;
      category: string;
    };
    pricing: {
      sellingPrice: number;
      comparePrice?: number;
    };
    images: { url: string; alt?: string }[];
    variants: Variant[];
    averageRating?: number;
    reviewCount?: number;
    publish?: {
      featured?: boolean;
    };
  };
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const colors = useMemo(() => {
    const seen = new Map<string, string | undefined>();
    product.variants.forEach((v) => {
      if (!seen.has(v.color)) seen.set(v.color, v.colorHex);
    });
    return Array.from(seen.entries()).map(([color, colorHex]) => ({
      color,
      colorHex,
    }));
  }, [product.variants]);

  const [selectedColor, setSelectedColor] = useState(colors[0]?.color ?? "");

  const sizesForColor = useMemo(() => {
    return product.variants
      .filter((v) => v.color === selectedColor)
      .map((v) => v.size);
  }, [product.variants, selectedColor]);

  const [selectedSize, setSelectedSize] = useState(sizesForColor[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!sizesForColor.includes(selectedSize)) {
      setSelectedSize(sizesForColor[0] ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColor]);

  const activeVariant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  const stock = activeVariant?.stock ?? 0;

  const addToCart = useCartStore((state) => state.addToCart);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeFromWishlist = useWishlistStore(
    (state) => state.removeFromWishlist
  );
  const isInWishlist = useWishlistStore((state) =>
    state.isInWishlist(product._id)
  );

  const coverImage =
    activeVariant?.image || product.images[0]?.url || "/placeholder.png";

  const rating = product.averageRating ?? 0;
  const reviewCount = product.reviewCount ?? 0;

  return (
    <div>
      {product.publish?.featured && (
        <span className="inline-block rounded-md bg-violet-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-violet-700">
          New Arrival
        </span>
      )}

      <h1 className="mt-3 text-3xl font-black text-black md:text-4xl">
        {product.basicInfo.title}
      </h1>

      <p className="mt-1 text-zinc-500">{product.basicInfo.category}</p>

      {reviewCount > 0 && (
        <div className="mt-3 flex items-center gap-2">
          <div className="flex text-violet-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(rating) ? "fill-violet-500" : "fill-none"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-zinc-500">
            {rating.toFixed(1)} ({reviewCount} reviews)
          </span>
        </div>
      )}

      <div className="mt-4 flex items-center gap-3">
        <span className="text-3xl font-bold text-black">
          ₹{product.pricing.sellingPrice}
        </span>

        {!!product.pricing.comparePrice && (
          <span className="text-lg text-zinc-400 line-through">
            ₹{product.pricing.comparePrice}
          </span>
        )}
      </div>
      <p className="text-xs text-zinc-400">Inclusive of all taxes</p>

      <p className="mt-5 leading-relaxed text-zinc-600">
        {product.basicInfo.description}
      </p>

      {/* Color */}
      {colors.length > 0 && (
        <div className="mt-8">
          <p className="mb-3 text-sm font-semibold text-black">
            Color: <span className="font-normal text-zinc-500">{selectedColor}</span>
          </p>
          <div className="flex gap-3">
            {colors.map(({ color, colorHex }) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`h-9 w-9 rounded-full border-2 transition ${
                  selectedColor === color
                    ? "border-violet-600"
                    : "border-zinc-200"
                }`}
                style={{ backgroundColor: colorHex || "#000" }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size */}
      {sizesForColor.length > 0 && (
        <div className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-black">
              Size: <span className="font-normal text-zinc-500">Select your size</span>
            </p>
            <button className="flex items-center gap-1 text-xs font-semibold text-violet-600 hover:underline">
              Size Guide
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {sizesForColor.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-semibold transition ${
                  selectedSize === size
                    ? "border-violet-600 bg-violet-600 text-white"
                    : "border-zinc-300 text-zinc-700 hover:border-violet-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 flex gap-3">
        <button
          disabled={stock <= 0}
          onClick={() => {
            addToCart({
              productId: product._id,
              slug: product.basicInfo.slug,
              title: product.basicInfo.title,
              image: coverImage,
              color: selectedColor,
              size: selectedSize,
              price: product.pricing.sellingPrice,
              quantity,
              stock,
              addedAt: new Date().toISOString(),
            });
            toast.success("Added to Cart 🛒");
          }}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 py-4 font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-zinc-300"
        >
          <ShoppingBag className="h-5 w-5" />
          {stock > 0 ? "ADD TO CART" : "OUT OF STOCK"}
        </button>

        <button
          onClick={() => {
            if (isInWishlist) {
              removeFromWishlist(product._id);
              toast.success("Removed from Wishlist");
              return;
            }
            addToWishlist({
              productId: product._id,
              slug: product.basicInfo.slug,
              title: product.basicInfo.title,
              image: coverImage,
              color: selectedColor,
              size: selectedSize,
              price: product.pricing.sellingPrice,
              stock,
            });
            toast.success("Added to Wishlist");
          }}
          className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-xl border border-zinc-300 transition hover:border-pink-400 hover:text-pink-500"
        >
          <Heart
            className={`h-5 w-5 ${
              mounted && isInWishlist ? "fill-pink-500 text-pink-500" : ""
            }`}
          />
        </button>
      </div>

      <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-black py-4 font-semibold text-white transition hover:bg-zinc-800">
        ⚡ BUY IT NOW
      </button>

      {/* Delivery */}
      <div className="mt-6 flex items-center justify-between rounded-xl border border-zinc-200 p-4">
        <div className="flex items-center gap-3">
          <Truck className="h-5 w-5 text-zinc-500" />
          <div>
            <p className="text-sm font-semibold text-black">
              Estimated Delivery
            </p>
            <p className="text-xs text-zinc-500">2-5 business days</p>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-zinc-400" />
      </div>
    </div>
  );
}