import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Heart,
  Star,
  Wallet,
  MapPin,
  Pencil,
  MoreVertical,
  Plus,
  Truck,
  CreditCard,
  Gift,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";

import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";
import AccountSidebar from "@/components/account/AccountSidebar";

// TODO (before launch): replace this dummy user/order data with real
// session + DB data (e.g. from your auth/session and Order model).
const USER = {
  name: "Aryan",
  memberSince: "March 2024",
  avatar: "/images/profile/profile-avatar-men.png",
  stats: {
    orders: 12,
    wishlist: 28,
    points: 860,
    credit: 250,
  },
};

const RECENT_ORDERS = [
  {
    id: "ZA8765",
    status: "Delivered",
    title: "Limitless Aura Oversized T-Shirt (Black)",
    meta: "Size: M · Qty: 1",
    date: "Delivered on 12 May 2024",
    price: 999,
    image: "/images/products/chaos-control/chaos-control-black.webp",
  },
  {
    id: "ZA8643",
    status: "Delivered",
    title: "Violet Void Oversized T-Shirt (White)",
    meta: "Size: L · Qty: 1",
    date: "Delivered on 28 Apr 2024",
    price: 999,
    image: "/images/products/future-unknown/future-unknown-black.webp",
  },
  {
    id: "ZA8521",
    status: "Shipped",
    title: "Shadow Ronin Hoodie (Black)",
    meta: "Size: M · Qty: 1",
    date: "Shipped on 18 Apr 2024",
    price: 1499,
    image: "/images/products/shadow-within/shadow-within-black.webp",
  },
];

const ADDRESSES = [
  {
    label: "Home",
    isDefault: true,
    name: "Aryan Verma",
    lines: ["A-23, Green Park Extension", "New Delhi - 110016, India"],
    phone: "+91 98765 43210",
  },
  {
    label: "College",
    isDefault: false,
    name: "Aryan Verma",
    lines: ["Room No. 204, Boys Hostel", "DTU, Rohini, Delhi - 110042"],
    phone: "+91 91234 56789",
  },
];

const QUICK_ACTIONS = [
  { icon: Truck, title: "Track Order", subtitle: "Check delivery status", href: "/account/orders" },
  { icon: MapPin, title: "Manage Addresses", subtitle: "Add or edit addresses", href: "/account/addresses" },
  { icon: CreditCard, title: "Payment Methods", subtitle: "Cards & UPI", href: "/account/wallet" },
  { icon: Star, title: "Arc Points", subtitle: "View points history", href: "/account/points" },
  { icon: Gift, title: "Refer & Earn", subtitle: "Invite friends", href: "/account/refer" },
  { icon: HelpCircle, title: "Help & Support", subtitle: "Get help anytime", href: "/account/help" },
];

function statusBadge(status: string) {
  const isDelivered = status === "Delivered";
  return (
    <span
      className={`rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
        isDelivered
          ? "bg-emerald-100 text-emerald-700"
          : "bg-violet-100 text-violet-700"
      }`}
    >
      {status}
    </span>
  );
}

export default function AccountDashboardPage() {
  return (
    <main className="min-h-screen bg-zinc-50">
      <AnnouncementBar />
      <Navbar />

      <div className="mx-auto max-w-[1400px] px-6 py-8 md:px-14">
        {/* Hero banner */}
        <div className="relative overflow-hidden rounded-2xl bg-black">
          <div className="absolute inset-0">
            <Image
              src="/images/profile/banner-01.png"
              alt=""
              fill
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-violet-500">
              <Image
                src={USER.avatar}
                alt={USER.name}
                fill
                className="object-cover"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white">
                Hey, {USER.name}! 👋
              </h1>
              <p className="mt-1 text-sm text-zinc-300">
                Welcome back to your arc.
              </p>

              <div className="mt-3 flex items-center gap-3">
                <span className="rounded-md bg-violet-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  Arc Member
                </span>
                <span className="text-xs text-zinc-400">
                  Member since {USER.memberSince}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: ShoppingBag, label: "Total Orders", value: USER.stats.orders },
            { icon: Heart, label: "Wishlist Items", value: USER.stats.wishlist },
            { icon: Star, label: "Arc Points", value: USER.stats.points },
            { icon: Wallet, label: "Store Credit", value: `₹${USER.stats.credit}` },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="rounded-2xl border border-zinc-200 bg-white p-5"
            >
              <div className="flex items-center gap-2 text-violet-600">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-2xl font-bold text-black">{value}</p>
              <p className="text-xs text-zinc-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          <AccountSidebar />

          <div className="flex-1 space-y-6">
            {/* Recent Orders */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-bold text-black">Recent Orders</h2>
                <Link
                  href="/account/orders"
                  className="text-sm font-semibold text-violet-600 hover:underline"
                >
                  View All Orders →
                </Link>
              </div>

              <div className="space-y-4">
                {RECENT_ORDERS.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col gap-4 border-b border-zinc-100 pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                      <Image
                        src={order.image}
                        alt={order.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-black">
                          Order #{order.id}
                        </span>
                        {statusBadge(order.status)}
                      </div>
                      <p className="mt-1 text-sm text-zinc-700">
                        {order.title}
                      </p>
                      <p className="text-xs text-zinc-400">{order.meta}</p>
                      <p className="text-xs text-zinc-400">{order.date}</p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="font-bold text-black">₹{order.price}</p>
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="text-xs font-semibold text-violet-600 hover:underline"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Saved Addresses */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-bold text-black">Saved Addresses</h2>
                  <Link
                    href="/account/addresses"
                    className="text-sm font-semibold text-violet-600 hover:underline"
                  >
                    View All →
                  </Link>
                </div>

                <div className="space-y-4">
                  {ADDRESSES.map((addr) => (
                    <div
                      key={addr.label}
                      className="flex items-start justify-between gap-3 border-b border-zinc-100 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex gap-3">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-black">
                              {addr.label}
                            </span>
                            {addr.isDefault && (
                              <span className="rounded-md bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase text-violet-700">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-zinc-500">
                            {addr.name}
                          </p>
                          {addr.lines.map((line) => (
                            <p key={line} className="text-xs text-zinc-500">
                              {line}
                            </p>
                          ))}
                          <p className="text-xs text-zinc-500">{addr.phone}</p>
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-1 text-zinc-400">
                        <button className="rounded-lg p-1.5 hover:bg-zinc-100 hover:text-violet-600">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button className="rounded-lg p-1.5 hover:bg-zinc-100 hover:text-violet-600">
                          <MoreVertical className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 py-3 text-sm font-semibold text-violet-600 transition hover:bg-violet-50">
                  <Plus className="h-4 w-4" />
                  Add New Address
                </button>
              </div>

              {/* Quick Actions + Security */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                  <h2 className="mb-4 font-bold text-black">Quick Actions</h2>

                  <div className="grid grid-cols-2 gap-4">
                    {QUICK_ACTIONS.map(({ icon: Icon, title, subtitle, href }) => (
                      <Link
                        key={title}
                        href={href}
                        className="flex items-start gap-2 rounded-xl p-2 transition hover:bg-zinc-50"
                      >
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
                        <div>
                          <p className="text-sm font-semibold text-black">
                            {title}
                          </p>
                          <p className="text-xs text-zinc-500">{subtitle}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                  <h2 className="mb-4 font-bold text-black">
                    Account Security
                  </h2>

                  <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-3">
                    <div className="flex items-center gap-2 text-sm text-emerald-700">
                      <ShieldCheck className="h-4 w-4" />
                      Your account is secure
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-zinc-500">
                    Last login: 25 May 2024, 10:30 AM
                  </p>

                  <Link
                    href="/account/security"
                    className="mt-2 inline-block text-sm font-semibold text-violet-600 hover:underline"
                  >
                    Manage Security →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Newsletter />
      <Footer />
    </main>
  );
}