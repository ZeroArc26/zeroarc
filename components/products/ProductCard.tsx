import Image from "next/image";
import Link from "next/link";

import { ProductVariant } from "@/types/product";

interface ProductCardProps {
  slug: string;
  name: string;
  price: number;
  variants: ProductVariant[];
  tag?: string;
}

export default function ProductCard({
  slug,
  name,
  price,
  variants,
  tag,
}: ProductCardProps) {
  const previewImage =
    variants.length > 0
      ? variants[0].image
      : "/images/products/placeholder.png";

  return (
    <Link href={`/products/${slug}`}>
      <div className="group overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/50 transition-all duration-300 hover:-translate-y-2 hover:border-purple-500/40 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]">

        <div className="relative aspect-square overflow-hidden bg-zinc-950">
          {tag && (
            <span className="absolute left-4 top-4 z-10 rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white">
              {tag}
            </span>
          )}

          <Image
            src={previewImage}
            alt={name}
            fill
            className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-white transition-colors group-hover:text-purple-400">
            {name}
          </h3>

          <p className="mt-2 text-lg font-semibold text-purple-400">
            ₹{price}
          </p>
        </div>

      </div>
    </Link>
  );
}