"use client";

import Link from "next/link";
import { Package2 } from "lucide-react";

import { adminNavItems } from "@/lib/admin/navigation";
import SidebarItem from "./SidebarItem";

interface SidebarProps {
  collapsed?: boolean;
}

export default function Sidebar({
  collapsed = false,
}: SidebarProps) {
  return (
    <aside
      className={`hidden h-screen border-r border-zinc-800 bg-zinc-950 transition-all duration-300 lg:flex lg:flex-col ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Logo */}
      <div className="flex h-20 items-center border-b border-zinc-800 px-6">
        <Link
          href="/admin"
          className="flex items-center gap-3"
        >
          <div className="rounded-xl bg-violet-600 p-2">
            <Package2 className="h-6 w-6 text-white" />
          </div>

          {!collapsed && (
            <div>
              <h2 className="text-lg font-bold text-white">
                ZeroArc
              </h2>

              <p className="text-xs text-zinc-400">
                Admin Dashboard
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {adminNavItems.map((item) => (
          <SidebarItem
            key={item.href}
            item={item}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t border-zinc-800 p-4">
          <p className="text-xs text-zinc-500">
            ZeroArc Admin v1.0
          </p>
        </div>
      )}
    </aside>
  );
}