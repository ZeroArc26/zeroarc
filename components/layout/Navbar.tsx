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

import { LogOut, UserCircle, Package, ChevronDown } from "lucide-react";
import CartDrawer from "@/components/cart/CartDrawer";

import SearchDrawer from "@/components/search/SearchDrawer";

type NavbarProps = {
  user: {
    id: string;
    email: string;
    fullName: string;
  } | null;
};

export default function Navbar({ user }: NavbarProps) {
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
  const [profileOpen, setProfileOpen] = useState(false);

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

            {user ? (
  <div className="relative">
    <button
      onClick={() => setProfileOpen(!profileOpen)}
      className="flex items-center gap-3 rounded-full border border-white/10 px-4 py-2 transition hover:border-purple-500"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 font-bold text-white">
        {user.fullName.charAt(0).toUpperCase()}
      </div>

      <div className="hidden md:block text-left">
        <p className="text-sm font-semibold text-white">
          {user.fullName}
        </p>

        <p className="text-xs text-zinc-400">
          {user.email}
        </p>
      </div>

      <ChevronDown size={16} />
    </button>

    {profileOpen && (
      <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-white/10 bg-zinc-950 p-2 shadow-2xl">
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-zinc-900"
        >
          <UserCircle size={18} />
          My Profile
        </Link>

        <Link
          href="/orders"
          className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-zinc-900"
        >
          <Package size={18} />
          My Orders
        </Link>

        <button
          onClick={async () => {
            await fetch("/api/auth/logout", {
              method: "POST",
            });

            window.location.reload();
          }}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 hover:bg-red-500/10"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    )}
  </div>
) : (
  <Link
    href="/login"
    className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 transition hover:border-purple-500"
  >
    <User size={18} />
    <span className="text-sm">Login</span>
  </Link>
)}
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