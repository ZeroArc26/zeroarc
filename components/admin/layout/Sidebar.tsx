"use client";

import Link from "next/link";
import {
  Package2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { adminNavItems } from "@/lib/admin/navigation";
import SidebarItem from "./SidebarItem";

interface SidebarProps {
  collapsed?: boolean;
  setCollapsed?: (value: boolean) => void;
}

export default function Sidebar({
  collapsed = false,
  setCollapsed = () => {},
}: SidebarProps) {
  return (
    <aside
  className={`relative flex h-screen shrink-0 flex-col border-r border-zinc-800 bg-zinc-950 transition-all duration-300 ${
  collapsed ? "w-20" : "w-72"
}`}
>
      {/* Logo */}
      <div className="flex h-24 items-center border-b border-zinc-800 px-6">
  <Link
    href="/admin"
    className="flex items-center gap-3"
  >
    <div className="relative">
      <div className="absolute inset-0 rounded-2xl bg-violet-500 blur-lg opacity-40" />

      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-500">
        <Package2 className="h-6 w-6 text-white" />
      </div>
    </div>

    {!collapsed && (
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white">
          ZeroArc
        </h2>

        <p className="text-xs text-zinc-400">
          Commerce Control Center
        </p>
      </div>
    )}
  </Link>
</div>

<button
  onClick={() => setCollapsed(!collapsed)}
  className="absolute right-[-14px] top-24 flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
>
  {collapsed ? (
    <ChevronRight className="h-4 w-4" />
  ) : (
    <ChevronLeft className="h-4 w-4" />
  )}
</button>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 p-4">
  {adminNavItems.map((item, index) => (
    <div key={item.title}>
      {item.section && !collapsed && (
        <p className="mb-3 px-3 text-[11px] font-semibold tracking-wider text-zinc-500">
          {item.section}
        </p>
      )}

      <SidebarItem
        item={item}
        collapsed={collapsed}
      />
    </div>
  ))}
</nav>

      {/* Footer */}
      {!collapsed && (
  <div className="border-t border-zinc-800 p-4">
    <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-3 transition hover:bg-zinc-900">

      {/* Avatar */}
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 text-sm font-bold text-white">
        ZA
      </div>

      {/* Info */}
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-white">
          Admin
        </h3>

        <p className="text-xs text-zinc-500">
          Store Manager
        </p>
      </div>

    </div>

    <p className="mt-3 text-center text-[11px] text-zinc-600">
      ZeroArc Admin v1.0
    </p>
  </div>
)}
    </aside>
  );
}