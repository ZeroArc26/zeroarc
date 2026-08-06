"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Heart,
  Star,
  Wallet,
  MapPin,
  User,
  ShieldCheck,
  Gift,
  HelpCircle,
  LogOut,
} from "lucide-react";

const MAIN_LINKS = [
  { label: "Dashboard", href: "/account", icon: LayoutDashboard },
  { label: "Orders", href: "/account/orders", icon: Package },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Arc Points", href: "#", icon: Star, disabled: true },
  { label: "Wallet", href: "#", icon: Wallet, disabled: true },
  { label: "Addresses", href: "/account", icon: MapPin },
  { label: "Security", href: "/account", icon: ShieldCheck },
];

const MORE_LINKS = [
  { label: "Refer & Earn", href: "#", icon: Gift, disabled: true },
  { label: "Help & Support", href: "/contact", icon: HelpCircle },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <aside className="w-full lg:w-[260px] shrink-0">
      <div className="rounded-2xl border border-zinc-200 bg-white p-4">
        <p className="mb-3 px-2 text-xs font-bold uppercase tracking-wide text-zinc-400">
          My Account
        </p>

        <nav className="space-y-1">
          {MAIN_LINKS.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href && !link.disabled;
            return (
              <Link
                key={link.label}
                href={link.disabled ? "#" : link.href}
                onClick={(e) => link.disabled && e.preventDefault()}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  link.disabled
                    ? "cursor-not-allowed text-zinc-300"
                    : active
                    ? "bg-violet-50 text-violet-700"
                    : "text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
                {link.disabled && (
                  <span className="ml-auto text-[10px] uppercase text-zinc-300">Soon</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="my-4 h-px bg-zinc-100" />

        <p className="mb-3 px-2 text-xs font-bold uppercase tracking-wide text-zinc-400">
          More
        </p>

        <nav className="space-y-1">
          {MORE_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                href={link.disabled ? "#" : link.href}
                onClick={(e) => link.disabled && e.preventDefault()}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  link.disabled
                    ? "cursor-not-allowed text-zinc-300"
                    : "text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
                {link.disabled && (
                  <span className="ml-auto text-[10px] uppercase text-zinc-300">Soon</span>
                )}
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:opacity-60"
          >
            <LogOut className="h-4 w-4" />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </nav>
      </div>
    </aside>
  );
}