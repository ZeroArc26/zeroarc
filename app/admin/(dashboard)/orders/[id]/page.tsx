"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

  products: {
    title: string;
    image: string;
    quantity: number;
    size: string;
    color: string;
    price: number;
  }[];

  subtotal: number;
  shipping: number;
  total: number;

  status: string;

  createdAt: string;
}

export default function OrderDetailsPage() {

  const { id } = useParams();

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [order, setOrder] = useState<Order | null>(null);

  const [status, setStatus] = useState("");
const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, []);

  async function fetchOrder() {
    try {

      const res = await fetch(`/api/orders/${id}`);

      const data = await res.json();

      if (data.success) {
  setOrder(data.order);
  setStatus(data.order.status);
}

    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus() {
  if (!order) return;

  try {
    setUpdating(true);

    const res = await fetch(`/api/orders/${order._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    alert("✅ Order status updated successfully!");

    setOrder(data.order);

  } catch (error) {
    console.error(error);

    alert("❌ Failed to update order.");
  } finally {
    setUpdating(false);
  }
}

  if (loading) {
    return (
      <main className="min-h-screen bg-[#09090B] flex items-center justify-center text-white">
        <h1 className="text-3xl font-bold">
          Loading Order...
        </h1>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-[#09090B] flex items-center justify-center text-white">
        <h1 className="text-3xl font-bold">
          Order Not Found
        </h1>
      </main>
    );
  }

    return (
    <main className="min-h-screen bg-[#09090B] py-32 text-white">

      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}

        <div className="mb-10 flex items-center justify-between">

          <div>

            <h1 className="text-5xl font-black">
              Order Details
            </h1>

            <p className="mt-2 text-zinc-400">
              Order ID: #{order._id.slice(-8).toUpperCase()}
            </p>

          </div>

          <button
            onClick={() => router.back()}
            className="rounded-2xl border border-zinc-700 px-6 py-3 font-semibold transition hover:border-violet-500"
          >
            ← Back
          </button>

        </div>

        {/* Top Cards */}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* Customer */}

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

            <h2 className="text-2xl font-bold">
              Customer
            </h2>

            <div className="mt-6 space-y-3">

              <p>
                <span className="text-zinc-500">Name</span><br />
                {order.customer.firstName} {order.customer.lastName}
              </p>

              <p>
                <span className="text-zinc-500">Email</span><br />
                {order.customer.email}
              </p>

              <p>
                <span className="text-zinc-500">Phone</span><br />
                {order.customer.phone}
              </p>

            </div>

          </div>

          {/* Shipping */}

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

            <h2 className="text-2xl font-bold">
              Shipping Address
            </h2>

            <div className="mt-6 space-y-2">

              <p>{order.shippingAddress.address}</p>

              <p>
                {order.shippingAddress.city},{" "}
                {order.shippingAddress.state}
              </p>

              <p>
                {order.shippingAddress.country}
              </p>

              <p>
                {order.shippingAddress.pincode}
              </p>

            </div>

          </div>

          {/* Summary */}

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

            <h2 className="text-2xl font-bold">
              Summary
            </h2>

            <div className="mt-6 space-y-4">

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{order.shipping}</span>
              </div>

              <div className="flex justify-between border-t border-zinc-700 pt-4 text-xl font-bold">
                <span>Total</span>
                <span className="text-violet-400">
                  ₹{order.total}
                </span>
              </div>

            </div>

          </div>

        </div>

                {/* Ordered Products */}

        <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

          <h2 className="text-3xl font-black">
            Ordered Products
          </h2>

          <div className="mt-8 space-y-5">

            {order.products.map((product, index) => (

              <div
                key={index}
                className="flex items-center gap-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
              >

                <img
                  src={product.image}
                  alt={product.title}
                  className="h-24 w-24 rounded-xl object-cover"
                />

                <div className="flex-1">

                  <h3 className="text-xl font-bold">
                    {product.title}
                  </h3>

                  <p className="mt-2 text-zinc-400">
                    Color : {product.color}
                  </p>

                  <p className="text-zinc-400">
                    Size : {product.size}
                  </p>

                  <p className="text-zinc-400">
                    Qty : {product.quantity}
                  </p>

                </div>

                <div className="text-right">

                  <p className="text-2xl font-black text-violet-400">
                    ₹{product.price}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* Order Actions */}

        <div className="mt-10 flex flex-wrap gap-4">

          <div className="flex items-center gap-3">

  <select
    value={status}
    onChange={(e) => setStatus(e.target.value)}
    className="rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-4 outline-none focus:border-violet-500"
  >
    <option value="Pending">Pending</option>
    <option value="Confirmed">Confirmed</option>
    <option value="Packed">Packed</option>
    <option value="Shipped">Shipped</option>
    <option value="Delivered">Delivered</option>
    <option value="Cancelled">Cancelled</option>
  </select>

  <button
    onClick={updateOrderStatus}
    disabled={updating}
    className="rounded-2xl bg-violet-600 px-8 py-4 font-bold transition hover:bg-violet-700 disabled:opacity-50"
  >
    {updating ? "Updating..." : "Save Status"}
  </button>

</div>

          <button
            onClick={() => window.print()}
            className="rounded-2xl border border-zinc-700 px-8 py-4 font-bold transition hover:border-violet-500"
          >
            Print Invoice
          </button>

          <button
            className="rounded-2xl bg-red-600 px-8 py-4 font-bold transition hover:bg-red-700"
          >
            Delete Order
          </button>

        </div>

      </div>

    </main>
  );
}