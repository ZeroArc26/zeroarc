"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Dropdown from "@/components/ui/dropdown/Dropdown";
import NotificationDropdown from "@/components/admin/NotificationDropdown";
import ProfileDropdown from "@/components/admin/ProfileDropdown";
import useCurrentAdmin from "@/hooks/useCurrentAdmin";

export default function TopNavbar() {
  const [search, setSearch] = useState("");
  const pathname = usePathname();
  const { admin, loading } = useCurrentAdmin();

const pageConfig: Record<
  string,
  {
    title: string;
    subtitle: string;
  }
> = {
  "/admin": {
    title: "Dashboard",
    subtitle: "Welcome back, Admin 👋",
  },

  "/admin/dashboard/products": {
    title: "Products",
    subtitle: "Manage your products",
  },

  "/admin/orders": {
    title: "Orders",
    subtitle: "Manage customer orders",
  },

  "/admin/customers": {
    title: "Customers",
    subtitle: "Manage your customers",
  },

  "/admin/inventory": {
    title: "Inventory",
    subtitle: "Track your stock",
  },

  "/admin/settings": {
    title: "Settings",
    subtitle: "Manage your store settings",
  },
};

const currentPage = pageConfig[pathname] || {
  title: "Admin",
  subtitle: "ZeroArc Admin Panel",
};
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
  {currentPage.title}
</h1>

<p className="text-sm text-zinc-500">
  {currentPage.subtitle}
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
  href={`/admin/dashboard/products/${product._id}`}
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

  <Dropdown
  trigger={
    <div className="relative rounded-2xl border border-zinc-700 bg-zinc-900 p-3 transition hover:border-violet-500">
      🔔

      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
        4
      </span>
    </div>
  }
>
  <NotificationDropdown />
</Dropdown>

  <Dropdown
  trigger={
    <button className="flex items-center gap-3 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2 transition hover:border-violet-500">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 font-bold">
  {loading
    ? "..."
    : admin?.name?.charAt(0).toUpperCase() ?? "A"}
</div>

<div className="hidden text-left md:block">
  <p className="text-sm font-semibold">
    {loading ? "Loading..." : admin?.name}
  </p>

  <p className="text-xs text-zinc-400">
    {loading ? "" : admin?.role.replace("_", " ")}
  </p>
</div>
    </button>
  }
>
  <ProfileDropdown />
</Dropdown>

</div>

    </header>
  );
}