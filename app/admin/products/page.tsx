"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Product {
  _id: string;

  title: string;

  slug: string;

  price: number;

  stock: number;

  featured: boolean;

  bestseller: boolean;

  newArrival: boolean;

  active: boolean;

  images: string[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");

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
    <main className="min-h-screen bg-[#09090B] py-32 text-white">

      <div className="mx-auto max-w-7xl px-6">

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-5xl font-black">
              Products
            </h1>

            <p className="mt-3 text-zinc-400">
              Manage all products.
            </p>

          </div>

          <Link
            href="/admin/products/add"
            className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-4 font-bold transition hover:scale-105"
          >
            + Add Product
          </Link>

        </div>

        <div className="mt-12">

          {loading ? (

            <p className="text-zinc-400">
              Loading Products...
            </p>

          ) : (

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                              {products.map((product) => (

                <div
                  key={product._id}
                  className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/40"
                >

                  <img
                    src={product.images?.[0] || "/placeholder.png"}
                    alt={product.title}
                    className="h-72 w-full object-cover"
                  />

                  <div className="p-6">

                    <h2 className="text-2xl font-bold">
                      {product.title}
                    </h2>

                    <p className="mt-2 text-lg font-semibold text-purple-400">
                      ₹{product.price}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">

                      {product.stock === 0 ? (

                        <span className="rounded-full bg-red-500/20 px-3 py-1 text-sm font-bold text-red-400">
                          Out of Stock
                        </span>

                      ) : product.stock <= 5 ? (

                        <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-sm font-bold text-yellow-400">
                          Low Stock ({product.stock})
                        </span>

                      ) : (

                        <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm font-bold text-green-400">
                          In Stock ({product.stock})
                        </span>

                      )}

                      {product.featured && (
                        <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm font-bold text-blue-400">
                          Featured
                        </span>
                      )}

                      {product.bestseller && (
                        <span className="rounded-full bg-orange-500/20 px-3 py-1 text-sm font-bold text-orange-400">
                          Bestseller
                        </span>
                      )}

                      {product.newArrival && (
                        <span className="rounded-full bg-pink-500/20 px-3 py-1 text-sm font-bold text-pink-400">
                          New
                        </span>
                      )}

                    </div>

                    <div className="mt-8 flex gap-3">

                      <Link
                        href={`/admin/products/edit/${product._id}`}
                        className="flex-1 rounded-xl bg-violet-600 py-3 text-center font-bold transition hover:bg-violet-700"
                      >
                        Edit
                      </Link>

                      <button
                        className="flex-1 rounded-xl bg-red-600 py-3 font-bold transition hover:bg-red-700"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </main>
  );
}