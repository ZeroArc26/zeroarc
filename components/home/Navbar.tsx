"use client";

import Link from "next/link";
import Image from "next/image";

import {
  Search,
  User,
  Heart,
  ShoppingBag,
} from "lucide-react";

export default function Navbar() {
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
            
          <Search className="h-6 w-6 cursor-pointer" />

          <User className="h-6 w-6 cursor-pointer" />

          <Heart className="h-6 w-6 cursor-pointer" />

          <div className="relative">

            <ShoppingBag className="h-6 w-6 cursor-pointer" />

            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
              0
            </span>

          </div>

        </div>

      </div>
    </header>
  );
}