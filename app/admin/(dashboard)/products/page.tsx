"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import ProductTable from "@/components/admin/products/ProductTable";
import ProductEmpty from "@/components/admin/products/ProductEmpty";
import ProductSkeleton from "@/components/admin/products/ProductSkeleton";
import type { Product } from "@/components/admin/products/ProductRow";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/admin/products");
        const data = await res.json();

        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>

          <p className="mt-2 text-zinc-400">
            Manage your entire product catalog.
          </p>

          <p className="mt-1 text-sm text-zinc-500">
            Total Products: {products.length}
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-5 py-3 font-semibold transition hover:bg-violet-500"
        >
          + Add Product
        </Link>
      </div>

      {loading ? (
        <ProductSkeleton />
      ) : products.length === 0 ? (
        <ProductEmpty />
      ) : (
        <ProductTable products={products} />
      )}
    </div>
  );
}