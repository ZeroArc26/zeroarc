"use client";

import Link from "next/link";
import { Search, ShoppingBag, User } from "lucide-react";

export default function Navbar() {
  return (
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

          <Link href="/collections" className="hover:text-white transition">
            Collections
          </Link>

          <Link href="/about" className="hover:text-white transition">
            About
          </Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-5 text-zinc-300">
          <Search className="cursor-pointer hover:text-white transition" size={20} />
          <ShoppingBag className="cursor-pointer hover:text-white transition" size={20} />
          <User className="cursor-pointer hover:text-white transition" size={20} />
        </div>
      </div>
    </header>
  );
}