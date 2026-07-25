"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import PageHeader from "@/components/admin/shared/PageHeader";
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
      <PageHeader
        title="Products"
        description={`Manage your entire product catalog • ${products.length} Products`}
        action={
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
          >
            + Add Product
          </Link>
        }
      />

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