import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { getCustomerById } from "@/lib/actions/customers/getCustomerById";

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailsPage({ params }: CustomerDetailPageProps) {
  const { id } = await params;

  const result = await getCustomerById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const customer = result.data;

  await connectDB();

  const orders = await Order.find({ "customer.email": customer.email })
    .sort({ createdAt: -1 })
    .lean<any[]>();

  const totalOrders = orders.length;
  const totalSpent = orders.reduce(
    (sum, o) => sum + (o.pricing?.grandTotal || 0),
    0
  );
  const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

  return (
    <main className="min-h-screen bg-[#09090B] py-16 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <Link
          href="/admin/dashboard/customers"
          className="mb-10 inline-flex items-center gap-2 rounded-xl bg-zinc-800 px-6 py-3 font-bold hover:bg-zinc-700"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Customer Info */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
            <h2 className="text-3xl font-bold">Customer Profile</h2>

            <div className="mt-8 space-y-4">
              <div>
                <p className="text-zinc-500">Name</p>
                <p className="text-xl font-semibold">{customer.name}</p>
              </div>

              <div>
                <p className="text-zinc-500">Email</p>
                <p>{customer.email}</p>
              </div>

              <div>
                <p className="text-zinc-500">Phone</p>
                <p>{customer.phone}</p>
              </div>

              <div>
                <p className="text-zinc-500">Status</p>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase ${
                    customer.status === "active"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-red-500/15 text-red-400"
                  }`}
                >
                  {customer.status}
                </span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
            <h2 className="text-3xl font-bold">Statistics</h2>

            <div className="mt-8 space-y-5">
              <div className="flex justify-between">
                <span>Total Orders</span>
                <span>{totalOrders}</span>
              </div>

              <div className="flex justify-between">
                <span>Total Spent</span>
                <span className="font-bold text-violet-400">
                  ₹{totalSpent.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Average Order</span>
                <span>₹{Math.round(averageOrderValue).toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between">
                <span>Customer Since</span>
                <span>
                  {new Date(customer.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_2fr]">
          {/* Saved Addresses */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
            <h2 className="text-3xl font-bold">Addresses</h2>

            <div className="mt-8 space-y-6">
              {customer.address?.address && (
                <div>
                  <p className="mb-1 text-xs font-bold uppercase text-zinc-500">
                    Latest Order Address
                  </p>
                  <p>{customer.address.address}</p>
                  <p>
                    {customer.address.city}, {customer.address.state}
                  </p>
                  <p>{customer.address.pincode}</p>
                  <p>{customer.address.country}</p>
                </div>
              )}

              {(customer.addresses || []).map((addr: any) => (
                <div key={addr._id} className="border-t border-zinc-800 pt-4">
                  <p className="mb-1 text-xs font-bold uppercase text-zinc-500">
                    {addr.label} {addr.isDefault && "(Default)"}
                  </p>
                  <p>{addr.name}</p>
                  <p>{addr.address}</p>
                  <p>
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p>{addr.phone}</p>
                </div>
              ))}

              {!customer.address?.address && (customer.addresses || []).length === 0 && (
                <p className="text-zinc-500">No addresses saved yet.</p>
              )}
            </div>
          </div>

          {/* Order History */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
            <h2 className="text-3xl font-bold">Order History</h2>

            <div className="mt-8 space-y-5">
              {orders.length === 0 && (
                <p className="text-zinc-500">No orders yet.</p>
              )}

              {orders.map((order) => (
                <Link
                  key={order._id}
                  href={`/admin/dashboard/orders/${order._id}`}
                  className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-violet-500/40"
                >
                  <div>
                    <p className="font-bold">
                      Order #{order.orderInfo?.orderNumber}
                    </p>
                    <p className="text-sm text-zinc-500">
                      {new Date(order.orderInfo?.orderDate).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-violet-400">
                      ₹{order.pricing?.grandTotal?.toLocaleString("en-IN")}
                    </p>
                    <p className="text-sm capitalize text-zinc-500">
                      {order.orderInfo?.status}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}