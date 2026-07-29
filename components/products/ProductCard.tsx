"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";

type Product = {
  _id: string;
  basicInfo: {
    title: string;
    slug: string;
  };

  pricing: {
    sellingPrice: number;
    comparePrice: number;
  };

  images: {
    url: string;
    alt: string;
  }[];

  publish: {
    featured: boolean;
  };
};

export default function ProductCard({
  product,
}: {
  product: Product;
}) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 transition duration-300 hover:-translate-y-1 hover:border-purple-500/50">

      <Link href={`/products/${product.basicInfo.slug}`}>

        <div className="relative aspect-square overflow-hidden bg-zinc-900">

          <Image
            src={product.images?.[0]?.url || "/products/default.webp"}
            alt={product.basicInfo.title}
            fill
            sizes="(max-width:768px) 100vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-110"
          />

        </div>

      </Link>

      <div className="space-y-3 p-5">

        <h3 className="line-clamp-1 text-lg font-bold text-white">
          {product.basicInfo.title}
        </h3>

        <div className="flex items-center gap-3">

          <span className="text-xl font-bold text-white">
            ₹{product.pricing.sellingPrice}
          </span>

          {product.pricing.comparePrice > 0 && (
            <span className="text-sm text-zinc-500 line-through">
              ₹{product.pricing.comparePrice}
            </span>
          )}

        </div>

        <div className="flex gap-3">

          <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 font-semibold text-white transition hover:scale-[1.02]">

            <ShoppingBag size={18} />

            Add to Cart

          </button>

          <button className="rounded-xl border border-white/10 p-3 transition hover:border-pink-500 hover:text-pink-500">

            <Heart size={20} />

          </button>

        </div>

      </div>

    </div>
  );
}