"use client";

import Image from "next/image";
import ProductActions from "./ProductActions";

type ProductTableProps = {
  products: any[];
};

export default function ProductTable({
  products,
}: ProductTableProps) {

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
                key={product._id}
                className="border-b border-zinc-800 transition hover:bg-zinc-900"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-800">
  <Image
    src={
      product.images?.find((img: any) => img.isCover)?.url ||
      product.images?.[0]?.url ||
      "/products/default.webp"
    }
    alt={product.basicInfo.title}
    fill
    className="object-cover"
  />
</div>

                    <div>
                      <h3 className="font-semibold text-white">
                        {product.basicInfo.title}
                      </h3>

                      <p className="text-sm text-zinc-500">
                        ID #{product._id}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-zinc-300">
                  {product.basicInfo.category}
                </td>

                <td className="px-6 py-4 font-medium text-white">
  ₹{product.pricing.sellingPrice}
</td>

                <td className="px-6 py-4 text-zinc-300">
  {product.inventory.quantity}
</td>

                <td className="px-6 py-4">
  <span
    className={`rounded-full px-3 py-1 text-xs font-medium ${
      product.publish.status === "active"
        ? "bg-emerald-500/15 text-emerald-400"
        : product.publish.status === "draft"
        ? "bg-yellow-500/15 text-yellow-400"
        : "bg-red-500/15 text-red-400"
    }`}
  >
    {product.publish.status}
  </span>
</td>

                <td className="px-6 py-4 text-right">
  <ProductActions
  productId={product._id}
productName={product.basicInfo.title}
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