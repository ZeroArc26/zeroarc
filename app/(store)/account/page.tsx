import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Heart,
  Star,
  Wallet,
  MapPin,
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
import SavedAddressesCard from "@/components/account/SavedAddressesCard";

import { getCurrentUser } from "@/lib/auth";
import { getOrdersByCustomerEmail } from "@/lib/actions/orders/getOrdersByCustomerEmail";

// TODO (before launch): Wallet/Arc Points are still placeholder data —
// those features aren't built yet (marked "SOON" in the sidebar
// already). Addresses now use real data via SavedAddressesCard.

const QUICK_ACTIONS = [
  { icon: Truck, title: "Track Order", subtitle: "Check delivery status", href: "/account/orders" },
  { icon: MapPin, title: "Manage Addresses", subtitle: "Add or edit addresses", href: "/account" },
  { icon: CreditCard, title: "Payment Methods", subtitle: "Cards & UPI", href: "/account/wallet" },
  { icon: Star, title: "Arc Points", subtitle: "View points history", href: "/account/points" },
  { icon: Gift, title: "Refer & Earn", subtitle: "Invite friends", href: "/account/refer" },
  { icon: HelpCircle, title: "Help & Support", subtitle: "Get help anytime", href: "/account/help" },
];

function statusBadge(status: string) {
  const isDelivered = status === "delivered";
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

export default async function AccountDashboardPage() {
  const user = await getCurrentUser();
  const orders = user?.email ? await getOrdersByCustomerEmail(user.email) : [];
  const recentOrders = orders.slice(0, 3);

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
                src="/images/profile/profile-avatar-men.png"
                alt={user?.fullName || "Account"}
                fill
                className="object-cover"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white">
                Hey, {user?.fullName?.split(" ")[0] || "there"}! 👋
              </h1>
              <p className="mt-1 text-sm text-zinc-300">
                Welcome back to your arc.
              </p>

              <div className="mt-3 flex items-center gap-3">
                <span className="rounded-md bg-violet-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  Arc Member
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: ShoppingBag, label: "Total Orders", value: orders.length },
            { icon: Heart, label: "Wishlist Items", value: "—" },
            { icon: Star, label: "Arc Points", value: "Soon" },
            { icon: Wallet, label: "Store Credit", value: "Soon" },
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

              {recentOrders.length === 0 ? (
                <p className="py-6 text-center text-sm text-zinc-500">
                  You haven&apos;t placed any orders yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order: any) => {
                    const firstItem = order.items?.[0];
                    return (
                      <div
                        key={order._id}
                        className="flex flex-col gap-4 border-b border-zinc-100 pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center"
                      >
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                          {firstItem?.image && (
                            <Image
                              src={firstItem.image}
                              alt={firstItem.name}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-black">
                              Order #{order.orderInfo?.orderNumber}
                            </span>
                            {statusBadge(order.orderInfo?.status)}
                          </div>
                          <p className="mt-1 text-sm text-zinc-700">
                            {firstItem?.name}
                          </p>
                          <p className="text-xs text-zinc-400">
                            {new Date(order.orderInfo?.orderDate).toLocaleDateString(
                              "en-IN",
                              { day: "2-digit", month: "short", year: "numeric" }
                            )}
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="font-bold text-black">
                            ₹{order.pricing?.grandTotal}
                          </p>
                          <Link
                            href={`/account/orders/${order._id}`}
                            className="text-xs font-semibold text-violet-600 hover:underline"
                          >
                            View Details →
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Saved Addresses */}
              <SavedAddressesCard />

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