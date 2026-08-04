"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Heart,
  Star,
  Wallet,
  MapPin,
  User,
  ShieldCheck,
  Bell,
  Gift,
  HelpCircle,
  LogOut,
} from "lucide-react";

const MAIN_LINKS = [
  { label: "Dashboard", href: "/account", icon: LayoutDashboard },
  { label: "Orders", href: "/account/orders", icon: Package },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Arc Points", href: "/account/points", icon: Star },
  { label: "Wallet", href: "/account/wallet", icon: Wallet },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Profile Information", href: "/account/profile", icon: User },
  { label: "Security", href: "/account/security", icon: ShieldCheck },
];

const MORE_LINKS = [
  { label: "Notifications", href: "/account/notifications", icon: Bell },
  { label: "Refer & Earn", href: "/account/refer", icon: Gift },
  { label: "Help & Support", href: "/account/help", icon: HelpCircle },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-[260px] shrink-0">
      <div className="rounded-2xl border border-zinc-200 bg-white p-4">
        <p className="mb-3 px-2 text-xs font-bold uppercase tracking-wide text-zinc-400">
          My Account
        </p>

        <nav className="space-y-1">
          {MAIN_LINKS.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-violet-50 text-violet-700"
                    : "text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
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
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50"
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}

          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </nav>
      </div>

      {/* Arc Member promo card */}
      <div className="relative mt-4 overflow-hidden rounded-2xl bg-black p-6">
        <div className="absolute -right-6 -bottom-6 h-40 w-32 opacity-80">
          <Image
            src="/images/profile/profile-avatar-women.png"
            alt=""
            fill
            className="object-contain object-bottom"
          />
        </div>

        <span className="relative z-10 inline-block rounded-md bg-violet-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
          Arc Member+
        </span>

        <p className="relative z-10 mt-3 max-w-[140px] text-sm text-zinc-300">
          You&apos;re earning exclusive rewards and early access to new drops!
        </p>

        <Link
          href="/account/points"
          className="relative z-10 mt-4 inline-block text-sm font-semibold text-violet-400 hover:underline"
        >
          Explore Benefits →
        </Link>
      </div>
    </aside>
  );
}