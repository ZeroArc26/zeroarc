"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

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

  const [open, setOpen] = useState(
    item.children?.some((child) =>
      pathname.startsWith(child.href)
    ) ?? false
  );

  const isActive =
    pathname === item.href ||
    (item.href !== "/admin" &&
      pathname.startsWith(item.href));

  const Icon = item.icon;

  // Parent item with children
  if (item.children) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
            open
              ? "bg-zinc-800 text-white"
              : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
          )}
        >
          <Icon className="h-5 w-5 shrink-0" />

          {!collapsed && (
            <>
              <span className="flex-1 text-left">
                {item.title}
              </span>

              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  open && "rotate-180"
                )}
              />
            </>
          )}
        </button>

        {!collapsed && open && (
          <div className="ml-5 space-y-1 border-l border-zinc-800 pl-3">
            {item.children.map((child) => (
              <SidebarItem
                key={child.href}
                item={child}
                collapsed={false}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Normal item
  return (
    <Link
      href={item.href}
      className={cn(
  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
  isActive
    ? "bg-gradient-to-r from-violet-600/30 via-violet-500/20 to-transparent text-white shadow-[0_0_20px_rgba(139,92,246,0.25)]"
    : "text-zinc-400 hover:bg-zinc-800/70 hover:text-white"
)}
    >
      <div
  className={cn(
    "transition-all duration-300",
    isActive
      ? "text-violet-400"
      : "text-zinc-500 group-hover:text-white"
  )}
>
  {isActive && (
  <span className="absolute left-0 h-8 w-1 rounded-r-full bg-violet-500" />
)}
  <Icon className="h-5 w-5 shrink-0" />
</div>

      {!collapsed && (
        <>
          <span className="flex-1">
            {item.title}
          </span>

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