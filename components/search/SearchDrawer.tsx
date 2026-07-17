"use client";

import { X, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { FEATURED_PRODUCTS } from "@/constants/products";
import SearchResultCard from "./SearchResultCard";

interface SearchDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchDrawer({
  open,
  onClose,
}: SearchDrawerProps) {
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];

    const search = query.toLowerCase();

    return FEATURED_PRODUCTS.filter((product) => {
      return (
        product.name.toLowerCase().includes(search) ||
        product.collection.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search) ||
        (product.tag ?? "").toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search) ||
        product.price.toString().includes(search) ||
        product.variants.some((variant) =>
          variant.color.toLowerCase().includes(search)
        )
      );
    });
  }, [query]);

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col border-l border-zinc-800 bg-[#09090B] shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 p-6">
          <h2 className="text-2xl font-bold text-white">
            Search
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

        {/* Search Input */}
        <div className="border-b border-zinc-800 p-6">
          <div className="flex items-center gap-3 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3">
            <Search
              size={18}
              className="text-zinc-400"
            />

            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-transparent text-white outline-none placeholder:text-zinc-500"
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6">

          {query && filteredProducts.length === 0 && (
            <div className="flex h-full items-center justify-center text-center">
              <div>
                <Search
                  size={45}
                  className="mx-auto text-zinc-700"
                />

                <p className="mt-4 text-zinc-400">
                  No products found
                </p>
              </div>
            </div>
          )}

          {!query && (
            <div className="flex h-full items-center justify-center text-center">
              <div>
                <Search
                  size={45}
                  className="mx-auto text-zinc-700"
                />

                <p className="mt-4 text-zinc-400">
                  Start typing to search products.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <SearchResultCard
                key={product.id}
                product={product}
                onClick={onClose}
              />
            ))}
          </div>

        </div>
      </div>
    </>
  );
}