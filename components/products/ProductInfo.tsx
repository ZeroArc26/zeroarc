"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Star, ShoppingBag, Heart, Check, Minus, Plus, ShieldCheck, Flame } from "lucide-react";

import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import SizeGuideModal from "@/components/products/SizeGuideModal";
import DeliveryEstimate from "@/components/products/DeliveryEstimate";
import { parseProductDescription } from "@/lib/utils/parseDescription";

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
  /** Lets a parent (e.g. the gallery, which needs to filter images by
   * the selected color) stay in sync with the color chosen here. */
  selectedColor?: string;
  onColorChange?: (color: string) => void;
  /** Real count of non-cancelled orders for this product in the last
   * 7 days — omitted from display entirely when 0, never faked. */
  recentPurchaseCount?: number;
  /** Real lowest price this product has been at (including current)
   * in the last 30 days — null when no genuine price change was
   * logged in that window, in which case nothing is shown. */
  lowestPriceLast30Days?: number | null;
}

export default function ProductInfo({
  product,
  selectedColor: selectedColorProp,
  onColorChange,
  recentPurchaseCount,
  lowestPriceLast30Days,
}: ProductInfoProps) {
  const router = useRouter();

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

  const [internalColor, setInternalColor] = useState(colors[0]?.color ?? "");
  const selectedColor = selectedColorProp ?? internalColor;
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const setSelectedColor = (color: string) => {
    setInternalColor(color);
    onColorChange?.(color);
  };

  const sizesForColor = useMemo(() => {
    return product.variants.filter((v) => v.color === selectedColor);
  }, [product.variants, selectedColor]);

  const [selectedSize, setSelectedSize] = useState(sizesForColor[0]?.size ?? "");
  const [quantity, setQuantity] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!selectedColorProp && internalColor) {
      onColorChange?.(internalColor);
    }
    // Only run when the resolved default color is first known — not on
    // every selection change (that's handled by setSelectedColor above).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const stillAvailable = sizesForColor.find((v) => v.size === selectedSize);
    if (!stillAvailable) {
      setSelectedSize(sizesForColor[0]?.size ?? "");
    }
    setQuantity(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColor]);

  const activeVariant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  const stock = activeVariant?.stock ?? 0;
  const isLowStock = stock > 0 && stock <= 5;

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

  const discountPercent = product.pricing.comparePrice
    ? Math.round(
        ((product.pricing.comparePrice - product.pricing.sellingPrice) /
          product.pricing.comparePrice) *
          100
      )
    : 0;

  function handleAddToCart() {
    if (stock <= 0) return;

    addToCart({
      productId: product._id,
      slug: product.basicInfo.slug,
      title: product.basicInfo.title,
      image: coverImage,
      color: selectedColor,
      size: selectedSize,
      price: product.pricing.sellingPrice,
      comparePrice: product.pricing.comparePrice,
      quantity,
      stock,
      addedAt: new Date().toISOString(),
    });

    toast.success("Added to Cart 🛒");
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  }

  function handleBuyNow() {
    if (stock <= 0) return;

    addToCart({
      productId: product._id,
      slug: product.basicInfo.slug,
      title: product.basicInfo.title,
      image: coverImage,
      color: selectedColor,
      size: selectedSize,
      price: product.pricing.sellingPrice,
      comparePrice: product.pricing.comparePrice,
      quantity,
      stock,
      addedAt: new Date().toISOString(),
    });

    router.push("/checkout");
  }

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
          <div className="flex text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(rating) ? "fill-yellow-400" : "fill-none"
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

        {discountPercent > 0 && (
          <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
            {discountPercent}% OFF
          </span>
        )}
      </div>
      <p className="text-xs text-zinc-400">Inclusive of all taxes</p>

      {lowestPriceLast30Days != null &&
        lowestPriceLast30Days < product.pricing.sellingPrice && (
          <p className="mt-1 text-xs text-zinc-400">
            Lowest price in the last 30 days: ₹{lowestPriceLast30Days}
          </p>
        )}

      {!!recentPurchaseCount && recentPurchaseCount > 0 && (
        <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-orange-600">
          <Flame className="h-3.5 w-3.5" />
          {recentPurchaseCount} {recentPurchaseCount === 1 ? "person" : "people"} bought this in the last 7 days
        </div>
      )}

      <p className="mt-5 leading-relaxed text-zinc-600">
        {parseProductDescription(product.basicInfo.description).narrative}
      </p>

      {/* Color */}
      {colors.length > 0 && (
        <div className="mt-8">
          <p className="mb-3 text-sm font-semibold text-black">
            Color: <span className="font-normal text-zinc-500">{selectedColor}</span>
          </p>
          <div className="flex flex-wrap gap-2.5">
            {colors.map(({ color, colorHex }) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`flex items-center gap-2 rounded-full border-2 py-1.5 pl-1.5 pr-3.5 transition ${
                  selectedColor === color
                    ? "border-violet-600 bg-violet-50"
                    : "border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <span
                  className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-black/10"
                  style={{ backgroundColor: colorHex || "#000" }}
                >
                  {selectedColor === color && (
                    <Check
                      className="h-3.5 w-3.5 drop-shadow"
                      style={{
                        color: colorHex && isLightColor(colorHex) ? "#000" : "#fff",
                      }}
                    />
                  )}
                </span>
                <span
                  className={`text-xs font-medium ${
                    selectedColor === color ? "text-violet-700" : "text-zinc-600"
                  }`}
                >
                  {color}
                </span>
              </button>
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
            <button
              onClick={() => setSizeGuideOpen(true)}
              className="flex items-center gap-1 text-xs font-semibold text-violet-600 hover:underline"
            >
              Size Guide
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {sizesForColor.map((variant) => {
              const outOfStock = variant.stock <= 0;
              return (
                <button
                  key={variant.size}
                  disabled={outOfStock}
                  onClick={() => setSelectedSize(variant.size)}
                  title={outOfStock ? "Out of stock" : undefined}
                  className={`relative flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-semibold transition ${
                    outOfStock
                      ? "cursor-not-allowed border-zinc-200 text-zinc-300"
                      : selectedSize === variant.size
                      ? "border-violet-600 bg-violet-600 text-white"
                      : "border-zinc-300 text-zinc-700 hover:border-violet-400"
                  }`}
                >
                  {variant.size}
                  {outOfStock && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="h-[1.5px] w-8 rotate-[-20deg] bg-zinc-300" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {isLowStock && (
        <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-red-500">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
          Only {stock} left in this size — order soon
        </p>
      )}

      {/* Quantity */}
      <div className="mt-7">
        <p className="mb-3 text-sm font-semibold text-black">Quantity</p>
        <div className="inline-flex items-center rounded-xl border border-zinc-300">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="flex h-11 w-11 items-center justify-center text-zinc-600 transition hover:text-black disabled:opacity-30"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-sm font-bold text-black">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(stock || 1, q + 1))}
            disabled={quantity >= stock}
            className="flex h-11 w-11 items-center justify-center text-zinc-600 transition hover:text-black disabled:opacity-30"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex gap-3">
        <button
          disabled={stock <= 0}
          onClick={handleAddToCart}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full bg-violet-600 py-4 font-semibold text-white transition-all duration-200 hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-zinc-300 ${
            justAdded ? "scale-[0.98]" : ""
          }`}
        >
          {justAdded ? (
            <>
              <Check className="h-5 w-5" />
              ADDED
            </>
          ) : (
            <>
              <ShoppingBag className="h-5 w-5" />
              {stock > 0 ? "ADD TO CART" : "OUT OF STOCK"}
            </>
          )}
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
          className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full border border-zinc-300 transition hover:border-pink-400 hover:text-pink-500"
        >
          <Heart
            className={`h-5 w-5 ${
              mounted && isInWishlist
                ? "fill-pink-500 text-pink-500"
                : "text-zinc-500"
            }`}
          />
        </button>
      </div>

      <button
        disabled={stock <= 0}
        onClick={handleBuyNow}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-black py-4 font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
      >
        ⚡ BUY IT NOW
      </button>

      {/* Delivery */}
      <DeliveryEstimate />

      <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
        100% authentic — every ZeroArc piece ships sealed and QC-checked.
      </div>

      {activeVariant?.sku && (
        <p className="mt-4 text-xs text-zinc-400">SKU: {activeVariant.sku}</p>
      )}

      <SizeGuideModal open={sizeGuideOpen} onOpenChange={setSizeGuideOpen} />
    </div>
  );
}

function isLightColor(hex: string) {
  const c = hex.replace("#", "");
  if (c.length !== 6) return false;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 180;
}