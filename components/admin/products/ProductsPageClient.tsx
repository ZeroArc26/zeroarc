"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import ProductActions from "./ProductActions";

interface ProductsPageClientProps {
  products: any[];
}

const PAGE_SIZE = 10;

export default function ProductsPageClient({
  products,
}: ProductsPageClientProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;

    return products.filter((product) =>
      product.basicInfo?.title?.toLowerCase().includes(q) ||
      product.basicInfo?.category?.toLowerCase().includes(q) ||
      product.inventory?.sku?.toLowerCase().includes(q)
    );
  }, [products, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-400">
          {filtered.length} product{filtered.length !== 1 ? "s" : ""}
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, category or SKU..."
              className="h-11 border-zinc-800 bg-zinc-900 pl-10 text-white placeholder:text-zinc-500 focus-visible:ring-violet-500"
            />
          </div>

          <Link href="/admin/dashboard/products/new">
            <Button className="h-11 w-full gap-2 rounded-xl bg-violet-600 px-5 hover:bg-violet-700 sm:w-auto">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Table */}
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
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                paginated.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-zinc-800 transition hover:bg-zinc-900"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-800">
                          <Image
                            src={
                              product.images?.find((img: any) => img.isCover)?.url ||
                              product.images?.[0]?.url ||
                              "/products/default.webp"
                            }
                            alt={product.basicInfo.title}
                            fill
                            sizes="56px"
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-zinc-800 px-6 py-4">
            <p className="text-sm text-zinc-500">
              Page {page} of {totalPages}
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-9 w-9 rounded-lg border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="h-9 w-9 rounded-lg border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}