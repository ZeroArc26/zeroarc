"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Customer {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };

  totalOrders: number;

  totalSpent: number;

  lastOrder: string;

  firstOrder: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    try {
      const res = await fetch("/api/customers");

      const data = await res.json();

      if (data.success) {
        setCustomers(data.customers);
      }

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
          Loading Customers...
        </h1>
      </main>
    );
  }

    return (
    <main className="min-h-screen bg-[#09090B] py-32 text-white">

      <div className="mx-auto max-w-7xl px-6">

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-5xl font-black">
              Customers
            </h1>

            <p className="mt-3 text-zinc-400">
              Manage all your customers.
            </p>

          </div>

        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {customers.length === 0 ? (

            <div className="col-span-full rounded-3xl border border-zinc-800 bg-zinc-900/40 p-12 text-center">

              <h2 className="text-3xl font-bold">
                No Customers Found
              </h2>

            </div>

          ) : (

            customers.map((item) => (
                              <div
                key={item.customer.email}
                className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 transition hover:border-violet-500"
              >

                <h2 className="text-2xl font-bold">
                  {item.customer.firstName} {item.customer.lastName}
                </h2>

                <p className="mt-2 text-zinc-400">
                  {item.customer.email}
                </p>

                <p className="text-zinc-500">
                  {item.customer.phone}
                </p>

                <div className="mt-6 space-y-2">

                  <div className="flex justify-between">
                    <span>Total Orders</span>
                    <span>{item.totalOrders}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Total Spent</span>
                    <span className="font-bold text-violet-400">
                      ₹{item.totalSpent}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Last Order</span>
                    <span>
                      {new Date(item.lastOrder).toLocaleDateString()}
                    </span>
                  </div>

                </div>

                <Link
                  href={`/admin/customers/${encodeURIComponent(item.customer.email)}`}
                  className="mt-8 block rounded-xl bg-violet-600 py-3 text-center font-bold transition hover:bg-violet-700"
                >
                  View Profile
                </Link>

              </div>
                          ))

          )}

        </div>

      </div>

    </main>
  );
}