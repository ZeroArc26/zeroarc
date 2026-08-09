import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  CheckCircle2,
  MapPin,
  Download,
  MessageCircle,
} from "lucide-react";

import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";
import AccountSidebar from "@/components/account/AccountSidebar";
import RequestReturnDialog from "@/components/account/RequestReturnDialog";

import { getOrderById } from "@/lib/actions/orders/getOrderById";
import { getCurrentUser } from "@/lib/auth";

function statusStyle(status: string) {
  switch (status) {
    case "delivered":
      return "bg-emerald-100 text-emerald-700";
    case "shipped":
      return "bg-violet-100 text-violet-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-amber-100 text-amber-700";
  }
}

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;

  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const user = await getCurrentUser();
  const isOwner =
    user?.email?.toLowerCase() === order.customer?.email?.toLowerCase();

  if (!isOwner) {
    notFound();
  }

  const status = order.orderInfo?.status || "pending";
  const address = order.customer?.shippingAddress || {};

  return (
    <main className="min-h-screen bg-zinc-50">
      <AnnouncementBar />
      <Navbar />

      <div className="mx-auto max-w-[1400px] px-6 py-8 md:px-14">
        <div className="flex flex-col gap-6 lg:flex-row">
          <AccountSidebar />

          <div className="flex-1">
            <Link href="/account/orders" className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-violet-600 hover:underline">
              <ChevronLeft className="h-4 w-4" />
              Back to Orders
            </Link>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black text-black">
                    Order #{order.orderInfo?.orderNumber}
                  </h1>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${statusStyle(status)}`}>
                    {status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-500">
                  Placed on{" "}
                  {new Date(order.orderInfo?.orderDate).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
                </p>
              </div>

              <div className="flex gap-3">
                <a href={`/api/orders/${order.id}/invoice`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:border-violet-400">
                  <Download className="h-4 w-4" />
                  Invoice
                </a>
                <Link href="/contact" className="flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:border-violet-400">
                  <MessageCircle className="h-4 w-4" />
                  Need Help?
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
              <div className="space-y-6">
                {status !== "cancelled" && (
                  <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                    <h2 className="mb-6 font-bold text-black">Order Tracking</h2>

                    {order.timeline.length === 0 ? (
                      <p className="text-sm text-zinc-500">No tracking updates yet.</p>
                    ) : (
                      <div className="relative pl-2">
                        {order.timeline.map((step: any, i: number) => (
                          <div key={i} className="relative flex gap-4 pb-8 last:pb-0">
                            {i < order.timeline.length - 1 && (
                              <span className="absolute left-[9px] top-6 h-full w-0.5 bg-violet-600" />
                            )}

                            <CheckCircle2 className="relative z-10 h-5 w-5 shrink-0 text-violet-600" />

                            <div>
                              <p className="text-sm font-semibold capitalize text-black">
                                {step.event}
                              </p>
                              <p className="text-xs text-zinc-400">
                                {step.date && new Date(step.date).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {status === "cancelled" && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                    <p className="text-sm font-semibold text-red-700">This order was cancelled.</p>
                  </div>
                )}

                <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                  <h2 className="mb-4 font-bold text-black">Items</h2>

                  <div className="space-y-4">
                    {(order.items || []).map((item: any, i: number) => (
                      <div key={i} className="flex items-center gap-4 border-b border-zinc-100 pb-4 last:border-0 last:pb-0">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                          {item.image && (
                            <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-black">{item.name}</p>
                          <p className="text-xs text-zinc-500">
                            Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-black">
                          ₹{item.totalAmount ?? item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                  <h2 className="mb-4 flex items-center gap-2 font-bold text-black">
                    <MapPin className="h-4 w-4 text-violet-600" />
                    Shipping Address
                  </h2>
                  <p className="text-sm font-semibold text-black">{order.customer?.name}</p>
                  <p className="text-sm text-zinc-500">{address.address}</p>
                  <p className="text-sm text-zinc-500">
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">{order.customer?.phone}</p>
                </div>
              </div>

              <div className="h-fit rounded-2xl border border-zinc-200 bg-white p-6">
                <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-black">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-zinc-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-black">₹{order.pricing?.subtotal}</span>
                  </div>
                  {(order.pricing?.discount ?? 0) > 0 && (
                    <div className="flex justify-between text-zinc-600">
                      <span>Discount</span>
                      <span className="font-semibold text-emerald-600">− ₹{order.pricing.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-zinc-600">
                    <span>Tax</span>
                    <span className="font-semibold text-black">₹{order.pricing?.totalTax}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4">
                  <span className="font-bold text-black">Total</span>
                  <span className="text-xl font-black text-violet-600">₹{order.pricing?.grandTotal}</span>
                </div>

                <div className="mt-4 border-t border-zinc-200 pt-4 text-sm">
                  <div className="flex justify-between text-zinc-600">
                    <span>Payment Method</span>
                    <span className="font-semibold uppercase text-black">{order.payment?.method}</span>
                  </div>
                  <div className="mt-2 flex justify-between text-zinc-600">
                    <span>Payment Status</span>
                    <span className="font-semibold capitalize text-black">{order.payment?.status}</span>
                  </div>
                </div>

                {status === "delivered" && (!order.returnInfo || order.returnInfo.status === "none") && (
                  (() => {
                    const deliveredEvent = order.timeline?.find(
                      (t: any) => t.event?.toLowerCase() === "delivered"
                    );
                    const daysSinceDelivery = deliveredEvent?.date
                      ? (Date.now() - new Date(deliveredEvent.date).getTime()) / (1000 * 60 * 60 * 24)
                      : 0;
                    const returnExpired = daysSinceDelivery > 7;

                    if (returnExpired) {
                      return (
                        <div className="mt-5 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-center">
                          <p className="text-sm font-semibold text-zinc-500">
                            Return window closed
                          </p>
                          <p className="mt-1 text-xs text-zinc-400">
                            Returns are accepted within 7 days of delivery.
                          </p>
                        </div>
                      );
                    }

                    return <RequestReturnDialog orderId={order.id} />;
                  })()
                )}

                {order.returnInfo && order.returnInfo.status !== "none" && (
                  <div className="mt-5 rounded-xl border border-zinc-200 p-4">
                    <p className="text-xs font-semibold uppercase text-zinc-500">
                      Return Status
                    </p>
                    <p className="mt-1 text-sm font-bold capitalize text-violet-600">
                      {order.returnInfo.status.replace("_", " ")}
                    </p>
                    {order.returnInfo.reason && (
                      <p className="mt-2 text-xs text-zinc-500">
                        Reason: {order.returnInfo.reason}
                      </p>
                    )}
                    {order.returnInfo.status === "pickup_scheduled" && order.returnInfo.pickupDate && (
                      <p className="mt-1 text-xs text-zinc-500">
                        Pickup scheduled:{" "}
                        {new Date(order.returnInfo.pickupDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    )}
                    {order.returnInfo.status === "refunded" && (
                      <p className="mt-1 text-xs font-semibold text-emerald-600">
                        ₹{order.returnInfo.refundAmount} refunded
                        {order.returnInfo.refundedAt &&
                          ` on ${new Date(order.returnInfo.refundedAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}`}
                      </p>
                    )}
                  </div>
                )}
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