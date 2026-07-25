"use client";

import { Menu, Bell, Search } from "lucide-react";

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({
  onMenuClick,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950/90 px-6 backdrop-blur">
      
      {/* Left */}
      <div className="flex items-center gap-4">

        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

          <input
            placeholder="Search..."
            className="h-10 w-72 rounded-xl border border-zinc-800 bg-zinc-900 pl-10 pr-4 text-sm outline-none transition focus:border-violet-500"
          />
        </div>
      </div>

      {/* Right */}

      <div className="flex items-center gap-3">

        <button className="relative rounded-xl p-2 transition hover:bg-zinc-800">
          <Bell className="h-5 w-5 text-zinc-300" />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <button className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 transition hover:bg-zinc-800">

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 font-semibold text-white">
            A
          </div>

          <div className="hidden text-left md:block">
            <p className="text-sm font-medium text-white">
              Admin
            </p>

            <p className="text-xs text-zinc-400">
              Super Admin
            </p>
          </div>

        </button>

      </div>

    </header>
  );
}