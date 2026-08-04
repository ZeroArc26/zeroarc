"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  Search,
  User,
  Heart,
  ShoppingBag,
  X,
} from "lucide-react";

import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { DUMMY_PRODUCTS } from "@/constants/dummy-products";

export default function Navbar() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);

  // Persisted stores only exist in localStorage, so gate real counts
  // behind `mounted` to avoid a server/client hydration mismatch.
  const cartCount = mounted
    ? cartItems.reduce((total, item) => total + item.quantity, 0)
    : 0;
  const wishlistCount = mounted ? wishlistItems.length : 0;

  // Search
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  const results =
    query.trim().length > 0
      ? DUMMY_PRODUCTS.filter((p) =>
          p.basicInfo.title.toLowerCase().includes(query.trim().toLowerCase())
        ).slice(0, 5)
      : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results[0]) {
      router.push(`/products/${results[0].basicInfo.slug}`);
      setSearchOpen(false);
      setQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-8 lg:px-12 xl:px-16">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/images/logo/zeroarc-logo.png"
            alt="ZeroArc"
            width={165}
            height={52}
            priority
            className="h-auto w-auto"
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden flex-1 items-center justify-center gap-12 lg:flex">
          <Link href="/" className="text-[13px] font-semibold tracking-[0.12em] text-zinc-900 transition-colors hover:text-violet-600">HOME</Link>
          <Link href="/men" className="text-[13px] font-semibold tracking-[0.12em] text-zinc-900 transition-colors hover:text-violet-600">MEN</Link>
          <Link href="/women" className="text-[13px] font-semibold tracking-[0.12em] text-zinc-900 transition-colors hover:text-violet-600">WOMEN</Link>
          <Link href="/collections" className="text-[13px] font-semibold tracking-[0.12em] text-zinc-900 transition-colors hover:text-violet-600">
            COLLECTIONS
          </Link>
          <Link href="/new-arrivals" className="text-[13px] font-semibold tracking-[0.12em] text-zinc-900 transition-colors hover:text-violet-600">
            NEW ARRIVALS
          </Link>
          <Link href="/about" className="text-[13px] font-semibold tracking-[0.12em] text-zinc-900 transition-colors hover:text-violet-600">
            ABOUT US
          </Link>
        </nav>

        {/* Icons */}
        <div className="flex shrink-0 items-center gap-5">
          {/* Search */}
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => setSearchOpen((prev) => !prev)}
              aria-label="Search"
            >
              <Search className="h-6 w-6 cursor-pointer text-zinc-900 transition hover:text-violet-600" />
            </button>

            {searchOpen && (
              <div className="absolute right-0 top-12 w-80 rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl">
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                  <input
                    autoFocus
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-violet-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      setQuery("");
                    }}
                    className="text-zinc-400 hover:text-zinc-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </form>

                {results.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {results.map((product) => (
                      <Link
                        key={product._id}
                        href={`/products/${product.basicInfo.slug}`}
                        onClick={() => {
                          setSearchOpen(false);
                          setQuery("");
                        }}
                        className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-zinc-50"
                      >
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-zinc-100">
                          <Image
                            src={product.images[0]?.url || "/placeholder.png"}
                            alt={product.basicInfo.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-black">
                            {product.basicInfo.title}
                          </p>
                          <p className="text-xs text-zinc-500">
                            ₹{product.pricing.sellingPrice}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {query.trim().length > 0 && results.length === 0 && (
                  <p className="mt-3 text-sm text-zinc-400">
                    No products found.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Profile */}
          <Link href="/account" aria-label="Account">
            <User className="h-6 w-6 cursor-pointer text-zinc-900 transition hover:text-violet-600" />
          </Link>

          {/* Wishlist */}
          <Link href="/account/wishlist" className="relative" aria-label="Wishlist">
            <Heart className="h-6 w-6 cursor-pointer text-zinc-900 transition hover:text-violet-600" />
            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative" aria-label="Cart">
            <ShoppingBag className="h-6 w-6 cursor-pointer text-zinc-900 transition hover:text-violet-600" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}