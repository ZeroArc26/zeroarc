import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
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

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Customer from "@/models/Customer";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/auth";
import { statusLabel, statusStyle } from "@/lib/orderStatus";

import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";
import AccountSidebar from "@/components/account/AccountSidebar";
import AccountAddressesSection from "@/components/account/AccountAddressesSection";
import WishlistCountBadge from "@/components/account/WishlistCountBadge";
import QuickActionsGrid from "@/components/account/QuickActionsGrid";

const QUICK_ACTIONS = [
  { icon: Truck, title: "Track Order", subtitle: "Check delivery status", href: "/account/orders" },
  { icon: MapPin, title: "Manage Addresses", subtitle: "Add or edit addresses", href: "/account/addresses" },
  { icon: CreditCard, title: "Payment Methods", subtitle: "Coming Soon", href: "#", disabled: true },
  { icon: Star, title: "Arc Points", subtitle: "Coming Soon", href: "#", disabled: true },
  { icon: Gift, title: "Refer & Earn", subtitle: "Coming Soon", href: "#", disabled: true },
  { icon: HelpCircle, title: "Help & Support", subtitle: "Get help anytime", href: "/contact" },
];

export default async function AccountDashboardPage() {
  const current = await getCurrentUser();

  if (!current) {
    redirect("/login");
  }

  await connectDB();

  const user = await User.findById(current.id).select("-password").lean<any>();

  if (!user) {
    redirect("/login");
  }

  const customer = await Customer.findOne({ email: user.email }).lean<any>();

  const recentOrders = await Order.find({ "customer.email": user.email })
    .sort({ createdAt: -1 })
    .limit(3)
    .lean<any[]>();

  const totalOrders =
    customer?.totalOrders ??
    (await Order.countDocuments({ "customer.email": user.email }));

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const addresses = (customer?.addresses || []).map((a: any) => ({
    ...a,
    _id: a._id.toString(),
  }));

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
                src={user.avatar || "/images/profile/profile-avatar-men.png"}
                alt={user.fullName}
                fill
                className="object-cover"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white">
                Hey, {user.fullName?.split(" ")[0] || "there"}! 👋
              </h1>
              <p className="mt-1 text-sm text-zinc-300">
                Welcome back to your arc.
              </p>

              <div className="mt-3 flex items-center gap-3">
                <span className="rounded-md bg-violet-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  Arc Member
                </span>
                <span className="text-xs text-zinc-400">
                  Member since {memberSince}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <ShoppingBag className="h-5 w-5 text-violet-600" />
            <p className="mt-3 text-2xl font-bold text-black">{totalOrders}</p>
            <p className="text-xs text-zinc-500">Total Orders</p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <Heart className="h-5 w-5 text-violet-600" />
            <p className="mt-3 text-2xl font-bold text-black">
              <WishlistCountBadge />
            </p>
            <p className="text-xs text-zinc-500">Wishlist Items</p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 opacity-60">
            <Star className="h-5 w-5 text-violet-600" />
            <p className="mt-3 text-sm font-bold text-black">Coming Soon</p>
            <p className="text-xs text-zinc-500">Arc Points</p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 opacity-60">
            <Wallet className="h-5 w-5 text-violet-600" />
            <p className="mt-3 text-sm font-bold text-black">Coming Soon</p>
            <p className="text-xs text-zinc-500">Store Credit</p>
          </div>
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
                <p className="text-sm text-zinc-500">
                  You haven&apos;t placed any orders yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => {
                    const firstItem = order.items?.[0];
                    const extraCount = (order.items?.length || 1) - 1;

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
                            <span
                              className={`rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${statusStyle(
                                order.orderInfo?.status
                              )}`}
                            >
                              {statusLabel(order.orderInfo?.status)}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-zinc-700">
                            {firstItem?.name}
                            {extraCount > 0 && ` + ${extraCount} more`}
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
                            href={`/account/orders/${order.orderInfo?.orderNumber}`}
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
              <AccountAddressesSection initialAddresses={addresses} />

              {/* Quick Actions + Security */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-zinc-200 bg-white p-6">
  <h2 className="mb-4 font-bold text-black">Quick Actions</h2>
  <QuickActionsGrid />
</div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                  <h2 className="mb-4 font-bold text-black">Account Security</h2>

                  <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-3">
                    <div className="flex items-center gap-2 text-sm text-emerald-700">
                      <ShieldCheck className="h-4 w-4" />
                      Your account is secure
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-zinc-500">{user.email}</p>
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