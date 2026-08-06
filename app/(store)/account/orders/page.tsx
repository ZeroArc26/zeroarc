import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight } from "lucide-react";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/auth";
import { statusLabel, statusStyle } from "@/lib/orderStatus";

import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";
import AccountSidebar from "@/components/account/AccountSidebar";
import OrdersFilterList from "@/components/account/OrdersFilterList";

export default async function OrdersPage() {
  const current = await getCurrentUser();

  if (!current) {
    redirect("/login");
  }

  await connectDB();

  const user = await User.findById(current.id).lean<any>();

  if (!user) {
    redirect("/login");
  }

  const orders = await Order.find({ "customer.email": user.email })
    .sort({ createdAt: -1 })
    .lean<any[]>();

  const serialized = orders.map((o) => ({
    id: o.orderInfo?.orderNumber,
    status: o.orderInfo?.status,
    orderDate: o.orderInfo?.orderDate,
    title: o.items?.[0]?.name || "Order",
    extraCount: (o.items?.length || 1) - 1,
    image: o.items?.[0]?.image || "",
    size: o.items?.[0]?.size,
    qty: o.items?.reduce((s: number, it: any) => s + it.quantity, 0) || 0,
    price: o.pricing?.grandTotal,
    paymentMethod: (o.payment?.method || "").toUpperCase(),
  }));

  return (
    <main className="min-h-screen bg-zinc-50">
      <AnnouncementBar />
      <Navbar />

      <div className="mx-auto max-w-[1400px] px-6 py-8 md:px-14">
        <div className="flex flex-col gap-6 lg:flex-row">
          <AccountSidebar />

          <div className="flex-1">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black uppercase text-black">
                  Orders
                </h1>
                <p className="mt-1 text-sm text-zinc-500">
                  Track, view and manage all your orders.
                </p>
              </div>
            </div>

            <OrdersFilterList orders={serialized} />
          </div>
        </div>
      </div>

      <Newsletter />
      <Footer />
    </main>
  );
}