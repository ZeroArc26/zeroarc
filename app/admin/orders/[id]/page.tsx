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
    price: number;
    size: string;
    color: string;
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

      if (!data.success) {
        router.push("/admin/orders");
        return;
      }

      setOrder(data.order);

setStatus(data.order.status);

    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate() {
  if (!order) return;

  setUpdating(true);

  try {
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

    setOrder(data.order);

    alert("✅ Order status updated successfully!");

  } catch (error) {
    console.error(error);

    alert("❌ Failed to update order.");
  } finally {
    setUpdating(false);
  }
}

async function handleDeleteOrder() {
  if (!order) return;

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this order?"
  );

  if (!confirmDelete) return;

  try {
    const res = await fetch(`/api/orders/${order._id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    alert("✅ Order deleted successfully!");

    router.push("/admin/orders");

  } catch (error) {
    console.error(error);

    alert("❌ Failed to delete order.");
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
    return null;
  }

  return (
    <main className="min-h-screen bg-[#09090B] py-32 text-white">

      <div className="mx-auto max-w-7xl px-6">

        <button
          onClick={() => router.back()}
          className="mb-10 rounded-xl bg-zinc-800 px-6 py-3 font-bold hover:bg-zinc-700"
        >
          ← Back
        </button>
                <div className="grid gap-8 lg:grid-cols-2">

          {/* Customer */}

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

            <h2 className="text-3xl font-bold">
              Customer
            </h2>

            <div className="mt-8 space-y-4">

              <div>

                <p className="text-zinc-500">
                  Name
                </p>

                <p className="text-xl font-semibold">
                  {order.customer.firstName}{" "}
                  {order.customer.lastName}
                </p>

              </div>

              <div>

                <p className="text-zinc-500">
                  Email
                </p>

                <p>{order.customer.email}</p>

              </div>

              <div>

                <p className="text-zinc-500">
                  Phone
                </p>

                <p>{order.customer.phone}</p>

              </div>

            </div>

          </div>

          {/* Shipping */}

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

            <h2 className="text-3xl font-bold">
              Shipping Address
            </h2>

            <div className="mt-8 space-y-4">

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
                <div className="mt-10 grid gap-8 lg:grid-cols-[2fr_1fr]">

          {/* Ordered Products */}

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

            <h2 className="text-3xl font-bold">
              Ordered Products
            </h2>

            <div className="mt-8 space-y-6">

              {order.products.map((product, index) => (

                <div
                  key={index}
                  className="flex gap-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
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
                      Size : {product.size}
                    </p>

                    <p className="text-zinc-400">
                      Color : {product.color}
                    </p>

                    <p className="text-zinc-400">
                      Quantity : {product.quantity}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-xl font-bold text-violet-400">
                      ₹{product.price}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* Order Summary */}

          <div className="h-fit rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

            <h2 className="text-3xl font-bold">
              Order Summary
            </h2>

            <div className="mt-8 space-y-4">

              <div className="flex justify-between">

                <span>Subtotal</span>

                <span>₹{order.subtotal}</span>

              </div>

              <div className="flex justify-between">

                <span>Shipping</span>

                <span>
                  {order.shipping === 0
                    ? "FREE"
                    : `₹${order.shipping}`}
                </span>

              </div>

              <div className="border-t border-zinc-800 pt-4 flex justify-between text-2xl font-bold">

                <span>Total</span>

                <span className="text-violet-400">
                  ₹{order.total}
                </span>

              </div>

              <div className="pt-6">

                <p className="text-zinc-500">
                  Order Date
                </p>

                <p className="mt-2">
                  {new Date(
                    order.createdAt
                  ).toLocaleString()}
                </p>

              </div>

            </div>
                      </div>

        </div>

        <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

          <h2 className="text-3xl font-bold">
            Update Order
          </h2>

          <div className="mt-8 flex flex-col gap-5 md:flex-row">

            <select
  value={status}
  onChange={(e) => setStatus(e.target.value)}
  className="flex-1 rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none"
>
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Packed</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>

            <button
  onClick={handleStatusUpdate}
  disabled={updating}
  className="rounded-xl bg-violet-600 px-8 py-4 font-bold transition hover:bg-violet-700 disabled:opacity-50"
>
  {updating ? "Updating..." : "Update Status"}
</button>

            <button
  onClick={handleDeleteOrder}
  className="rounded-xl bg-red-600 px-8 py-4 font-bold transition hover:bg-red-700"
>
  Delete Order
</button>

          </div>

        </div>

      </div>

    </main>
  );
}