"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { AdminNavItem } from "@/lib/admin/navigation";

interface SidebarItemProps {
  item: AdminNavItem;
  collapsed?: boolean;
}

export default function SidebarItem({
  item,
  collapsed = false,
}: SidebarItemProps) {
  const pathname = usePathname();

  const isActive =
    pathname === item.href ||
    (item.href !== "/admin" && pathname.startsWith(item.href));

  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-violet-600 text-white"
          : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />

      {!collapsed && (
        <>
          <span className="flex-1">{item.title}</span>

          {item.badge !== undefined && (
            <span className="rounded-full bg-zinc-700 px-2 py-0.5 text-xs text-white">
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
}