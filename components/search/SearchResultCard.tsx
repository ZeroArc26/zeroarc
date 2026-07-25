"use client";

import Image from "next/image";
import Link from "next/link";

import { FeaturedProduct } from "@/types/featured-product";

interface SearchResultCardProps {
  product: FeaturedProduct;
  onClick: () => void;
}

export default function SearchResultCard({
  product,
  onClick,
}: SearchResultCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      onClick={onClick}
      className="group flex gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 transition-all duration-300 hover:border-purple-500 hover:bg-zinc-900"
    >
      <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-zinc-950">
        <Image
          src={product.variants[0].image}
          alt={product.name}
          fill
          className="object-contain p-2 transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col justify-center">
        {product.tag && (
          <span className="mb-2 w-fit rounded-full bg-purple-600/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-purple-400">
            {product.tag}
          </span>
        )}

        <h3 className="font-semibold text-white">
          {product.name}
        </h3>

        <p className="mt-1 text-sm text-zinc-400">
          {product.category}
        </p>

        <div className="mt-2 flex items-center gap-2">
          <span className="font-bold text-purple-400">
            ₹{product.price}
          </span>

          {product.originalPrice && (
            <span className="text-sm text-zinc-500 line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}