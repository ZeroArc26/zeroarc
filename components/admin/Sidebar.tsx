"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  BarChart3,
  TicketPercent,
  Boxes,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: ShoppingBag,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: Package,
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Coupons",
    href: "/admin/coupons",
    icon: TicketPercent,
  },
  {
    title: "Inventory",
    href: "/admin/inventory",
    icon: Boxes,
  },
  {
    title: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-zinc-800 bg-[#0B0B0D]">

      {/* Logo */}

      <div className="border-b border-zinc-800 px-8 py-8">
        <h1 className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-3xl font-black text-transparent">
          ZeroArc
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Admin Dashboard
        </p>
      </div>

      {/* Navigation */}

      <nav className="flex-1 space-y-2 px-5 py-8">

        {menuItems.map((item) => {
          const Icon = item.icon;

          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-4 rounded-2xl px-5 py-4 font-semibold transition-all duration-300 ${
                active
                  ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              <Icon size={22} />

              <span>{item.title}</span>
            </Link>
          );
        })}

      </nav>

      {/* Logout */}

      <div className="border-t border-zinc-800 p-5">

        <button className="flex w-full items-center gap-4 rounded-2xl px-5 py-4 font-semibold text-red-400 transition hover:bg-red-500/10">

          <LogOut size={22} />

          Logout

        </button>

      </div>

    </aside>
  );
}