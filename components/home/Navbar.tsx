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
  Menu,
  ChevronDown,
} from "lucide-react";

import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";

export default function Navbar() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);

  const cartCount = mounted
    ? cartItems.reduce((total, item) => total + item.quantity, 0)
    : 0;
  const wishlistCount = mounted ? wishlistItems.length : 0;

  // Search
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  const [results, setResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }

    setSearchLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/products/search?q=${encodeURIComponent(trimmed)}`
        );
        const data = await res.json();
        setResults(data.success ? data.products : []);
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  // Mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);

  // Desktop category dropdown
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    function handleClickOutsideCategory(e: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutsideCategory);
    return () => document.removeEventListener("mousedown", handleClickOutsideCategory);
  }, []);

  const categoryLinks = [
    { href: "/men", label: "MENS" },
    { href: "/women", label: "WOMENS" },
    { href: "/unisex", label: "UNISEX" },
  ];

  const navLinks = [
    { href: "/", label: "HOME" },
    { href: "/collections", label: "COLLECTIONS" },
    { href: "/new-arrivals", label: "NEW ARRIVALS" },
    { href: "/about", label: "ABOUT US" },
  ];

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
    <>
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-8 lg:px-12 xl:px-16">
        {/* Hamburger (mobile) + Logo */}
        <div className="flex shrink-0 items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            className="-ml-1 p-1 text-zinc-900 transition hover:text-violet-600 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

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
        </div>

        {/* Navigation */}
        <nav className="hidden flex-1 items-center justify-center gap-12 lg:flex">
          <Link href="/" className="text-[13px] font-semibold tracking-[0.12em] text-zinc-900 transition-colors hover:text-violet-600">HOME</Link>

          {/* Category dropdown */}
          <div className="relative" ref={categoryRef}>
            <button
              onClick={() => setCategoryOpen((prev) => !prev)}
              className="flex items-center gap-1 text-[13px] font-semibold tracking-[0.12em] text-zinc-900 transition-colors hover:text-violet-600"
            >
              CATEGORY
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${categoryOpen ? "rotate-180" : ""}`}
              />
            </button>

            {categoryOpen && (
              <div className="absolute left-1/2 top-10 w-44 -translate-x-1/2 rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl">
                {categoryLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setCategoryOpen(false)}
                    className="block rounded-xl px-4 py-3 text-[13px] font-semibold tracking-[0.1em] text-zinc-900 transition hover:bg-zinc-50 hover:text-violet-600"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

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

                {searchLoading && (
                  <p className="mt-3 text-sm text-zinc-400">Searching...</p>
                )}

                {!searchLoading && query.trim().length > 0 && results.length === 0 && (
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

    {/* Mobile menu backdrop */}
    <div
      onClick={() => setMobileMenuOpen(false)}
      className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
        mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    />

    {/* Mobile menu drawer */}
    <div
      className={`fixed left-0 top-0 z-[70] h-full w-[80%] max-w-xs bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-20 items-center justify-between border-b border-zinc-200 px-6">
        <Image
          src="/images/logo/zeroarc-logo.png"
          alt="ZeroArc"
          width={140}
          height={44}
          className="h-auto w-auto"
        />
        <button
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu"
          className="p-1 text-zinc-900 transition hover:text-violet-600"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <nav className="flex flex-col px-6 py-4">
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="border-b border-zinc-100 py-4 text-sm font-semibold tracking-[0.12em] text-zinc-900 transition-colors hover:text-violet-600"
        >
          HOME
        </Link>

        {/* Category accordion */}
        <div className="border-b border-zinc-100">
          <button
            onClick={() => setMobileCategoryOpen((prev) => !prev)}
            className="flex w-full items-center justify-between py-4 text-sm font-semibold tracking-[0.12em] text-zinc-900 transition-colors hover:text-violet-600"
          >
            CATEGORY
            <ChevronDown
              className={`h-4 w-4 transition-transform ${mobileCategoryOpen ? "rotate-180" : ""}`}
            />
          </button>

          {mobileCategoryOpen && (
            <div className="flex flex-col pb-3 pl-4">
              {categoryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 text-sm font-medium tracking-[0.1em] text-zinc-600 transition-colors hover:text-violet-600"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {navLinks
          .filter((link) => link.href !== "/")
          .map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="border-b border-zinc-100 py-4 text-sm font-semibold tracking-[0.12em] text-zinc-900 transition-colors hover:text-violet-600"
            >
              {link.label}
            </Link>
          ))}
      </nav>

      <div className="flex items-center gap-6 px-6 py-5">
        <Link
          href="/account"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-2 text-sm text-zinc-700 transition hover:text-violet-600"
        >
          <User className="h-5 w-5" />
          Account
        </Link>

        <Link
          href="/account/wishlist"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-2 text-sm text-zinc-700 transition hover:text-violet-600"
        >
          <Heart className="h-5 w-5" />
          Wishlist
          {wishlistCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
              {wishlistCount}
            </span>
          )}
        </Link>
      </div>
    </div>
    </>
  );
}