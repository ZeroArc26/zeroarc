"use client";

import Link from "next/link";
import {
  Search,
  ShoppingBag,
  User,
  Heart,
} from "lucide-react";
import { useState, useEffect } from "react";

import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import WishlistDrawer from "@/components/wishlist/WishlistDrawer";

import CartDrawer from "@/components/cart/CartDrawer";

import SearchDrawer from "@/components/search/SearchDrawer";

export default function Navbar() {
  const totalItems = useCartStore((state) =>
    state.getTotalItems()
  );

  const totalWishlistItems = useWishlistStore((state) =>
    state.getTotalItems()
  );
  
  const [searchOpen, setSearchOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold tracking-widest text-white"
          >
            ZEROARC
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-300">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>

            <Link href="/shop" className="hover:text-white transition">
              Shop
            </Link>

            <Link
              href="/collections"
              className="hover:text-white transition"
            >
              Collections
            </Link>

            <Link href="/about" className="hover:text-white transition">
              About
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-5 text-zinc-300">
            <button
  onClick={() => setSearchOpen(true)}
  className="cursor-pointer transition hover:text-white"
>
  <Search size={20} />
</button>

            {/* Wishlist */}
            <div
  className="relative cursor-pointer"
  onClick={() => setWishlistOpen(true)}
>
              <Heart
                size={20}
                className="transition hover:text-white"
              />

              {mounted && totalWishlistItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-pink-600 text-[10px] font-bold text-white">
                  {totalWishlistItems}
                </span>
              )}
            </div>

            {/* Cart */}
            <div
              className="relative cursor-pointer"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag
                size={20}
                className="transition hover:text-white"
              />

              {mounted && totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </div>

            <User
              size={20}
              className="cursor-pointer transition hover:text-white"
            />
          </div>
        </div>
      </header>

      <SearchDrawer
  open={searchOpen}
  onClose={() => setSearchOpen(false)}
/>

      <WishlistDrawer
        open={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
/>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </>
  );
}