"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2 } from "lucide-react";

import ProductStatusBadge from "./ProductStatusBadge";
import DeleteProductDialog from "./DeleteProductDialog";

export type Product = {
  _id: string;
  slug: string;
  title: string;
  category: string;
  price: number;
  stock: number;
  active: boolean;
  images: string[];
};

type ProductRowProps = {
  product: Product;
};

export default function ProductRow({
  product,
}: ProductRowProps) {
  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/products/${product._id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Failed to delete product.");
        return;
      }

      alert("✅ Product deleted successfully!");

      setDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <tr className="group border-t border-zinc-800 transition-all duration-200 hover:bg-zinc-900/50">
        {/* Product Image */}
        <td className="px-6 py-5">
          <div className="group relative h-16 w-16 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
            <Image
              src={product.images?.[0] || "/placeholder.png"}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </td>

        {/* Product Info */}
        <td className="px-6 py-5">
          <div className="space-y-1">
            <h3 className="max-w-[240px] truncate font-semibold text-white">
              {product.title}
            </h3>

            <p className="text-xs text-zinc-500">
              {product.slug}
            </p>
          </div>
        </td>

        {/* Category */}
        <td className="px-6 py-5">
          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
            {product.category}
          </span>
        </td>

        {/* Price */}
        <td className="px-6 py-5">
          <p className="font-semibold text-white">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
        </td>

        {/* Stock */}
        <td className="px-6 py-5">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              product.stock > 20
                ? "bg-emerald-500/15 text-emerald-400"
                : product.stock > 5
                ? "bg-yellow-500/15 text-yellow-400"
                : "bg-red-500/15 text-red-400"
            }`}
          >
            {product.stock} in stock
          </span>
        </td>

        {/* Status */}
        <td className="px-6 py-5">
          <ProductStatusBadge active={product.active} />
        </td>

        {/* Actions */}
        <td className="px-6 py-5">
          <div className="flex items-center gap-2">
            <Link
              href={`/products/${product.slug}`}
              className="rounded-lg border border-zinc-700 p-2 text-zinc-300 transition-all hover:border-violet-500 hover:bg-zinc-800 hover:text-violet-400"
              title="View Product"
            >
              <Eye className="h-4 w-4" />
            </Link>

            <Link
              href={`/admin/products/${product._id}/edit`}
              className="rounded-lg border border-zinc-700 p-2 text-zinc-300 transition-all hover:border-blue-500 hover:bg-zinc-800 hover:text-blue-400"
              title="Edit Product"
            >
              <Pencil className="h-4 w-4" />
            </Link>

            <button
              onClick={() => setDialogOpen(true)}
              className="rounded-lg border border-red-700 p-2 text-red-400 transition-all hover:bg-red-600 hover:text-white"
              title="Delete Product"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>

      <DeleteProductDialog
        open={dialogOpen}
        productTitle={product.title}
        loading={deleting}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}