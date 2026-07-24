"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import ProductTable from "@/components/admin/ProductTable";

interface Product {
  _id: string;
  title: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [stockFilter, setStockFilter] = useState("All");

const [sortBy, setSortBy] = useState("Newest");

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const filteredProducts = products
  .filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      product.category === category;

    const matchesStock =
      stockFilter === "All"
        ? true
        : stockFilter === "In Stock"
        ? product.stock > 10
        : product.stock <= 10;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesStock
    );
  })
  .sort((a, b) => {
    switch (sortBy) {
      case "Price Low":
        return a.price - b.price;

      case "Price High":
        return b.price - a.price;

      case "Stock":
        return b.stock - a.stock;

      default:
        return 0;
    }
  });

  const totalProducts = products.length;

  const activeProducts = products.filter(
    (product) => product.stock > 10
  ).length;

  const lowStockProducts = products.filter(
    (product) => product.stock <= 10
  ).length;

  const totalCategories = new Set(
    products.map((product) => product.category)
  ).size;

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  if (loading) {
    return (
      <main className="min-h-screen bg-[#09090B] flex items-center justify-center text-white">
        <h1 className="text-3xl font-bold">
          Loading Products...
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090B] py-32 text-white">

      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}

        <div className="mb-10 flex items-center justify-between">

          <div>

            <h1 className="text-5xl font-black">
              Products
            </h1>

            <p className="mt-2 text-zinc-500">
              Manage all your store products
            </p>

          </div>

          <Link
            href="/admin/products/add"
            className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-4 font-bold transition hover:scale-105"
          >
            + Add Product
          </Link>

        </div>

        {/* Stats */}

        <div className="mb-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
            <p className="text-zinc-500">
              Total Products
            </p>

            <h2 className="mt-3 text-4xl font-black">
              {totalProducts}
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
            <p className="text-zinc-500">
              Active Products
            </p>

            <h2 className="mt-3 text-4xl font-black text-green-400">
              {activeProducts}
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
            <p className="text-zinc-500">
              Low Stock
            </p>

            <h2 className="mt-3 text-4xl font-black text-red-400">
              {lowStockProducts}
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
            <p className="text-zinc-500">
              Categories
            </p>

            <h2 className="mt-3 text-4xl font-black text-violet-400">
              {totalCategories}
            </h2>
          </div>

        </div>

        {/* Search */}

        <div className="relative mb-8">

          <Search
            size={20}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500"
          />

          <input
            type="text"
            placeholder="Search Products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 py-4 pl-14 pr-6 text-white outline-none transition focus:border-violet-500"
          />

        </div>

        {/* Category Filters */}

        <div className="mb-8 flex flex-wrap gap-3">

          {categories.map((item) => (

            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                category === item
                  ? "bg-violet-600 text-white"
                  : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
              }`}
            >
              {item}
            </button>

          ))}

        </div>

        {/* Toolbar */}

<div className="mb-8 flex flex-wrap items-center justify-between gap-4">

  <div className="flex gap-3">

    <select
      value={stockFilter}
      onChange={(e) => setStockFilter(e.target.value)}
      className="rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-white outline-none transition hover:border-violet-500 focus:border-violet-500"
    >
      <option>All</option>
      <option>In Stock</option>
      <option>Low Stock</option>
    </select>

    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      className="rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-white outline-none transition hover:border-violet-500 focus:border-violet-500"
    >
      <option>Newest</option>
      <option>Price Low</option>
      <option>Price High</option>
      <option>Stock</option>
    </select>

  </div>

  <p className="text-sm text-zinc-500">
    Showing{" "}
    <span className="font-bold text-white">
      {filteredProducts.length}
    </span>{" "}
    Products
  </p>

</div>

        {/* Product Table */}

        <ProductTable
          products={filteredProducts}
        />

      </div>

    </main>
  );
}