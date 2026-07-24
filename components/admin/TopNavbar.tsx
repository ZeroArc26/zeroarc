"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function TopNavbar() {
  const [search, setSearch] = useState("");
const [showResults, setShowResults] = useState(false);

const [results, setResults] = useState<{
  products: any[];
  orders: any[];
  customers: any[];
}>({
  products: [],
  orders: [],
  customers: [],
});

useEffect(() => {
  if (!search.trim()) {
    setResults({
      products: [],
      orders: [],
      customers: [],
    });
    return;
  }

  const timeout = setTimeout(async () => {
    try {
      const res = await fetch(
        `/api/admin/search?q=${encodeURIComponent(search)}`
      );

      const data = await res.json();

      if (data.success) {
        setResults(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, 300);

  return () => clearTimeout(timeout);
}, [search]);
  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-zinc-800 bg-[#09090B]/80 px-8 backdrop-blur-xl">

      <div>
        <h1 className="text-2xl font-black">
          Dashboard
        </h1>

        <p className="text-sm text-zinc-500">
          Welcome back, Admin 👋
        </p>
      </div>

      <div className="flex items-center gap-4">

  <div className="relative">

    <input
      type="text"
      placeholder="Search products, orders, customers..."
      value={search}
      onFocus={() => setShowResults(true)}
      onBlur={() => {
        setTimeout(() => setShowResults(false), 200);
      }}
      onChange={(e) => setSearch(e.target.value)}
      className="w-80 rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-3 outline-none transition focus:border-violet-500"
    />

    {showResults && search && (
      <div className="absolute left-0 top-16 z-50 w-80 rounded-2xl border border-zinc-800 bg-zinc-900 p-3 shadow-2xl">

        <p className="mb-2 text-xs uppercase tracking-widest text-zinc-500">
          Search Results
        </p>

        {results.products.length === 0 &&
 results.orders.length === 0 &&
 results.customers.length === 0 ? (

  <p className="rounded-xl px-4 py-3 text-zinc-500">
    No results found
  </p>

) : (

  <>
    {results.products.map((product: any) => (
      <Link
  key={product._id}
  href={`/admin/products/edit/${product._id}`}
  className="flex w-full items-center rounded-xl px-4 py-3 transition hover:bg-zinc-800"
>
  📦 {product.title}
</Link>
    ))}

    {results.orders.map((order: any) => (
      <Link
  key={order._id}
  href={`/admin/orders/${order._id}`}
  className="flex w-full items-center rounded-xl px-4 py-3 transition hover:bg-zinc-800"
>
  🛒 Order #{order.orderNumber}
</Link>
    ))}

    {results.customers.map((customer: any) => (
      <Link
  key={customer._id}
  href={`/admin/customers/${customer._id}`}
  className="flex w-full items-center rounded-xl px-4 py-3 transition hover:bg-zinc-800"
>
  👤 {customer.firstName} {customer.lastName}
</Link>
    ))}
  </>
)}

      </div>
    )}

  </div>

  <button className="rounded-2xl border border-zinc-700 bg-zinc-900 p-3 transition hover:border-violet-500">
    🔔
  </button>

  <button className="flex items-center gap-3 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2 transition hover:border-violet-500">

    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 font-bold">
      A
    </div>

    <div className="text-left">
      <p className="font-semibold">Admin</p>
      <p className="text-xs text-zinc-500">Super Admin</p>
    </div>

  </button>

</div>

    </header>
  );
}