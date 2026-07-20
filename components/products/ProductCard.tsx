"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";

type Product = {
  _id: string;
  title: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  bestseller?: boolean;
  newArrival?: boolean;
};

export default function ProductCard({
  product,
}: {
  product: Product;
}) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 transition duration-300 hover:-translate-y-1 hover:border-purple-500/50">

      <Link href={`/products/${product.slug}`}>

        <div className="relative aspect-square overflow-hidden bg-zinc-900">

          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes="(max-width:768px) 100vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-110"
          />

          {product.newArrival && (
            <span className="absolute left-4 top-4 rounded-full bg-purple-600 px-3 py-1 text-xs font-bold text-white">
              NEW
            </span>
          )}

          {product.bestseller && (
            <span className="absolute right-4 top-4 rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold text-black">
              BEST
            </span>
          )}

        </div>

      </Link>

      <div className="space-y-3 p-5">

        <h3 className="line-clamp-1 text-lg font-bold text-white">
          {product.title}
        </h3>

        <div className="flex items-center gap-3">

          <span className="text-xl font-bold text-white">
            ₹{product.price}
          </span>

          {product.comparePrice && (
            <span className="text-sm text-zinc-500 line-through">
              ₹{product.comparePrice}
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