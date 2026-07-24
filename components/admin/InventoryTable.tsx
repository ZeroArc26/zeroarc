"use client";

import Image from "next/image";
import { RotateCcw } from "lucide-react";

interface Product {
  _id: string;
  title: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
}

interface Props {
  products: Product[];
}

export default function InventoryTable({
  products,
}: Props) {
  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/40">

      <table className="w-full">

        <thead className="border-b border-zinc-800 bg-zinc-950">

          <tr className="text-left text-sm font-semibold text-zinc-400">

            <th className="px-6 py-5">Product</th>

            <th>Category</th>

            <th>SKU</th>

            <th>Stock</th>

            <th>Available</th>

            <th>Status</th>

            <th className="text-center">
              Restock
            </th>

          </tr>

        </thead>

        <tbody>

            {products.map((product) => (

  <tr
    key={product._id}
    className="border-b border-zinc-800 transition hover:bg-zinc-800/30"
  >

    {/* Product */}

    <td className="px-6 py-5">

      <div className="flex items-center gap-4">

        <Image
          src={product.images[0]}
          alt={product.title}
          width={60}
          height={60}
          className="rounded-xl object-cover"
        />

        <div>

          <h3 className="font-bold text-white">
            {product.title}
          </h3>

          <p className="text-sm text-zinc-500">
            ₹{product.price}
          </p>

        </div>

      </div>

    </td>

    {/* Category */}

    <td>
      {product.category}
    </td>

    {/* SKU */}

    <td className="font-mono text-sm text-zinc-400">
      ZA-{product._id.slice(-6).toUpperCase()}
    </td>

    {/* Total Stock */}

    <td className="font-bold">
      {product.stock}
    </td>

    {/* Available Stock */}

    <td className="text-green-400 font-semibold">
      {Math.max(product.stock - 2, 0)}
    </td>

    {/* Status */}

    <td>

      <span
        className={`rounded-full px-3 py-1 text-xs font-bold ${
          product.stock > 10
            ? "bg-green-500/20 text-green-400"
            : product.stock > 0
            ? "bg-yellow-500/20 text-yellow-400"
            : "bg-red-500/20 text-red-400"
        }`}
      >
        {product.stock > 10
          ? "Healthy"
          : product.stock > 0
          ? "Low Stock"
          : "Out of Stock"}
      </span>

    </td>

    {/* Restock */}

    <td>

      <div className="flex justify-center">

        <button
          className="rounded-xl bg-violet-600 p-3 transition hover:bg-violet-700"
        >
          <RotateCcw size={18} />
        </button>

      </div>

    </td>

  </tr>

))}
        </tbody>

      </table>

    </div>
  );
}