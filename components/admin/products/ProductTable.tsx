"use client";

import Image from "next/image";
import ProductActions from "./ProductActions";

const products = [
  {
    id: "1",
    name: "ZeroArc Oversized Tee",
    category: "Oversized T-Shirt",
    price: "₹999",
    stock: 42,
    status: "Active",
    image: "https://placehold.co/80x80/png",
  },
  {
    id: "2",
    name: "Naruto Hoodie",
    category: "Hoodie",
    price: "₹1,499",
    stock: 18,
    status: "Active",
    image: "https://placehold.co/80x80/png",
  },
  {
    id: "3",
    name: "Tokyo Street Tee",
    category: "T-Shirt",
    price: "₹799",
    stock: 7,
    status: "Low Stock",
    image: "https://placehold.co/80x80/png",
  },
];

export default function ProductTable() {
  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/40">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-zinc-800 bg-zinc-900">
            <tr className="text-left text-sm text-zinc-400">
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Stock</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-zinc-800 transition hover:bg-zinc-900"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-xl border border-zinc-800 bg-zinc-800" />

                    <div>
                      <h3 className="font-semibold text-white">
                        {product.name}
                      </h3>

                      <p className="text-sm text-zinc-500">
                        ID #{product.id}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-zinc-300">
                  {product.category}
                </td>

                <td className="px-6 py-4 font-medium text-white">
                  {product.price}
                </td>

                <td className="px-6 py-4 text-zinc-300">
                  {product.stock}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      product.status === "Active"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-yellow-500/15 text-yellow-400"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
  <ProductActions
  productId={product.id}
  productName={product.name}
/>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}