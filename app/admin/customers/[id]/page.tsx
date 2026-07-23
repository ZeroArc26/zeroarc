"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface CustomerDetails {
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

  orders: any[];

  stats: {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
  };
}

export default function CustomerDetailsPage() {
  const { id } = useParams();

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [customer, setCustomer] =
    useState<CustomerDetails | null>(null);

  useEffect(() => {
    fetchCustomer();
  }, []);

  async function fetchCustomer() {
    try {
      const res = await fetch(
        `/api/customers/${id}`
      );

      const data = await res.json();

      if (!data.success) {
        router.push("/admin/customers");
        return;
      }

      setCustomer(data);

    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#09090B] flex items-center justify-center text-white">
        <h1 className="text-4xl font-bold">
          Loading Customer...
        </h1>
      </main>
    );
  }

  if (!customer) return null;

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

        {/* Customer Info */}

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

          <h2 className="text-3xl font-bold">
            Customer Profile
          </h2>

          <div className="mt-8 space-y-4">

            <div>
              <p className="text-zinc-500">Name</p>
              <p className="text-xl font-semibold">
                {customer.customer.firstName} {customer.customer.lastName}
              </p>
            </div>

            <div>
              <p className="text-zinc-500">Email</p>
              <p>{customer.customer.email}</p>
            </div>

            <div>
              <p className="text-zinc-500">Phone</p>
              <p>{customer.customer.phone}</p>
            </div>

          </div>

        </div>

        {/* Statistics */}

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

          <h2 className="text-3xl font-bold">
            Statistics
          </h2>

          <div className="mt-8 space-y-5">

            <div className="flex justify-between">
              <span>Total Orders</span>
              <span>{customer.stats.totalOrders}</span>
            </div>

            <div className="flex justify-between">
              <span>Total Spent</span>
              <span className="font-bold text-violet-400">
                ₹{customer.stats.totalSpent}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Average Order</span>
              <span>
                ₹{Math.round(customer.stats.averageOrderValue)}
              </span>
            </div>

          </div>

        </div>

      </div>
            <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_2fr]">

        {/* Shipping Address */}

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

          <h2 className="text-3xl font-bold">
            Shipping Address
          </h2>

          <div className="mt-8 space-y-3">

            <p>{customer.shippingAddress.address}</p>

            <p>
              {customer.shippingAddress.city},{" "}
              {customer.shippingAddress.state}
            </p>

            <p>{customer.shippingAddress.pincode}</p>

            <p>{customer.shippingAddress.country}</p>

          </div>

        </div>

        {/* Order History */}

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

          <h2 className="text-3xl font-bold">
            Order History
          </h2>

          <div className="mt-8 space-y-5">

            {customer.orders.map((order) => (

              <div
                key={order._id}
                className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
              >

                <div>

                  <p className="font-bold">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </p>

                  <p className="text-sm text-zinc-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>

                </div>

                <div className="text-right">

                  <p className="font-bold text-violet-400">
                    ₹{order.total}
                  </p>

                  <p className="text-sm text-zinc-500">
                    {order.status}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  </main>
);
}