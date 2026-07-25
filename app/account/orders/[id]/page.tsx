"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Product {
  productId: string;
  title: string;
  slug: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;

  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };

  shippingAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };

  products: Product[];

  totalItems: number;
  subtotal: number;
  shipping: number;
  total: number;

  paymentMethod: "COD" | "ONLINE";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";

  status:
    | "Pending"
    | "Confirmed"
    | "Packed"
    | "Shipped"
    | "Delivered"
    | "Cancelled";

  createdAt: string;
}

export default function OrderDetailsPage() {
  const params = useParams();

  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);

        const data = await res.json();

        if (data.success) {
          setOrder(data.order);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#09090B] text-white">
        Loading Order...
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#09090B] text-white">
        Order not found.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090B] py-32 text-white">
      <div className="mx-auto max-w-6xl px-6">

        <Link
          href="/account/orders"
          className="text-sm text-violet-400 hover:text-violet-300"
        >
          ← Back to Orders
        </Link>

        <div className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>
              <h1 className="text-4xl font-black">
                Order Details
              </h1>

              <p className="mt-2 text-zinc-400">
                Order ID: {order._id}
              </p>

              <p className="mt-1 text-zinc-400">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-3 text-right">

              <span className="inline-block rounded-full bg-violet-600/20 px-4 py-2 text-sm font-semibold text-violet-300">
                {order.status}
              </span>

              <div className="text-sm text-zinc-300">
                Payment: {order.paymentMethod}
              </div>

              <div className="text-sm text-zinc-300">
                Payment Status: {order.paymentStatus}
              </div>

            </div>

          </div>

        </div>

                {/* Products & Customer Info */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">

          {/* Products */}
          <div className="lg:col-span-2 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

            <h2 className="mb-6 text-2xl font-bold">
              Ordered Products
            </h2>

            <div className="space-y-6">

              {order.products.map((product) => (
                <div
                  key={`${product.productId}-${product.size}-${product.color}`}
                  className="flex flex-col gap-5 rounded-2xl border border-zinc-800 p-5 sm:flex-row"
                >

                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-32 w-32 rounded-xl object-cover"
                  />

                  <div className="flex flex-1 flex-col justify-between">

                    <div>

                      <h3 className="text-xl font-semibold">
                        {product.title}
                      </h3>

                      <div className="mt-3 flex flex-wrap gap-2 text-sm text-zinc-400">

                        <span>
                          Color: <span className="text-white">{product.color}</span>
                        </span>

                        <span>•</span>

                        <span>
                          Size: <span className="text-white">{product.size}</span>
                        </span>

                      </div>

                    </div>

                    <div className="mt-4 flex items-center justify-between">

                      <p className="text-zinc-400">
                        Qty: {product.quantity}
                      </p>

                      <p className="text-lg font-bold">
                        ₹{product.price * product.quantity}
                      </p>

                    </div>

                  </div>

                </div>
              ))}

            </div>

          </div>

          {/* Customer & Shipping */}
          <div className="space-y-8">

            {/* Customer */}
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

              <h2 className="mb-5 text-2xl font-bold">
                Customer
              </h2>

              <div className="space-y-3 text-zinc-300">

                <p>
                  <span className="font-semibold text-white">
                    Name:
                  </span>{" "}
                  {order.customer.firstName} {order.customer.lastName}
                </p>

                <p>
                  <span className="font-semibold text-white">
                    Email:
                  </span>{" "}
                  {order.customer.email}
                </p>

                <p>
                  <span className="font-semibold text-white">
                    Phone:
                  </span>{" "}
                  {order.customer.phone}
                </p>

              </div>

            </div>

            {/* Shipping Address */}
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

              <h2 className="mb-5 text-2xl font-bold">
                Shipping Address
              </h2>

              <div className="space-y-2 text-zinc-300">

                <p>
                  {order.shippingAddress.address}
                </p>

                <p>
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state}
                </p>

                <p>
                  {order.shippingAddress.pincode}
                </p>

                <p>
                  {order.shippingAddress.country}
                </p>

              </div>

            </div>

          </div>

        </div>

                {/* Bottom Section */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">

          {/* Price Summary */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

            <h2 className="mb-6 text-2xl font-bold">
              Price Summary
            </h2>

            <div className="space-y-4">

              <div className="flex items-center justify-between text-zinc-300">
                <span>Items ({order.totalItems})</span>
                <span>₹{order.subtotal}</span>
              </div>

              <div className="flex items-center justify-between text-zinc-300">
                <span>Shipping</span>
                <span>
                  {order.shipping === 0 ? "FREE" : `₹${order.shipping}`}
                </span>
              </div>

              <div className="border-t border-zinc-700 pt-4 flex items-center justify-between text-xl font-bold">
                <span>Total</span>
                <span>₹{order.total}</span>
              </div>

            </div>

          </div>

          {/* Payment & Order Status */}
          <div className="space-y-8">

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

              <h2 className="mb-6 text-2xl font-bold">
                Payment Details
              </h2>

              <div className="space-y-4">

                <div className="flex justify-between">
                  <span className="text-zinc-400">
                    Payment Method
                  </span>

                  <span className="font-medium">
                    {order.paymentMethod}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-400">
                    Payment Status
                  </span>

                  <span
                    className={`font-medium ${
                      order.paymentStatus === "PAID"
                        ? "text-green-400"
                        : order.paymentStatus === "FAILED"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>

              </div>

            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

              <h2 className="mb-6 text-2xl font-bold">
                Order Status
              </h2>

              <div
                className={`inline-flex rounded-full px-5 py-2 font-semibold ${
                  order.status === "Delivered"
                    ? "bg-green-500/20 text-green-400"
                    : order.status === "Cancelled"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-violet-500/20 text-violet-300"
                }`}
              >
                {order.status}
              </div>

              <p className="mt-4 text-sm text-zinc-400">
                Your order is currently{" "}
                <span className="font-medium text-white">
                  {order.status}
                </span>.
                We'll keep you updated as it progresses.
              </p>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}