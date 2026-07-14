import Image from "next/image";

interface ProductCardProps {
  name: string;
  price: number;
  image: string;
  tag: string;
}

export default function ProductCard({
  name,
  price,
  image,
  tag,
}: ProductCardProps) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/50 transition-all duration-300 hover:-translate-y-2 hover:border-purple-500/40">
      <div className="relative aspect-square overflow-hidden bg-zinc-950">
        <span className="absolute left-4 top-4 z-10 rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white">
          {tag}
        </span>

        <Image
          src={image}
          alt={name}
          fill
          className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-white">
          {name}
        </h3>

        <p className="mt-2 text-purple-400 font-semibold">
          ₹{price}
        </p>
      </div>
    </div>
  );
}