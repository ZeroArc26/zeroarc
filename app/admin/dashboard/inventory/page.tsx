"use client";

import { useEffect, useState } from "react";

import InventoryTable from "@/components/admin/InventoryTable";


interface Product {
  _id: string;
  title: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
}
export default function InventoryPage() {
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState<Product[]>([]);

  const totalUnits = products.reduce(
  (sum, product) => sum + product.stock,
  0
);

const inventoryValue = products.reduce(
  (sum, product) => sum + product.price * product.stock,
  0
);

const lowStock = products.filter(
  (product) => product.stock > 0 && product.stock <= 10
).length;

const outOfStock = products.filter(
  (product) => product.stock === 0
).length;

  async function fetchProducts() {
  try {
    const res = await fetch("/api/products");

    const data = await res.json();

    if (data.success) {
      setProducts(data.products);
    }

  } catch (error) {
    console.error(error);
  }
}

useEffect(() => {
  async function loadData() {
    await fetchProducts();

    setLoading(false);
  }

  loadData();
}, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#09090B] text-white">
        <h1 className="text-3xl font-bold">
          Loading Inventory...
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090B] py-32 text-white">

      <div className="mx-auto max-w-7xl px-6">

        <h1 className="text-5xl font-black">
          Inventory
        </h1>

        <p className="mt-3 text-zinc-400">
          Manage your stock professionally.
        </p>

        {/* Inventory Cards */}

<div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

  <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

    <p className="text-zinc-500">
      Total Units
    </p>

    <h2 className="mt-3 text-5xl font-black">
      {totalUnits}
    </h2>

    <p className="mt-2 text-green-400">
      +12 this week
    </p>

  </div>
  

  <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

    <p className="text-zinc-500">
      Inventory Value
    </p>

    <h2 className="mt-3 text-5xl font-black text-violet-400">
      ₹{inventoryValue.toLocaleString()}
    </h2>

    <p className="mt-2 text-zinc-500">
      Estimated stock value
    </p>

  </div>

  <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

    <p className="text-zinc-500">
      Low Stock
    </p>

    <h2 className="mt-3 text-5xl font-black text-yellow-400">
      {lowStock}
    </h2>

    <p className="mt-2 text-yellow-400">
      Needs attention
    </p>

  </div>

  <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

    <p className="text-zinc-500">
      Out Of Stock
    </p>

    <h2 className="mt-3 text-5xl font-black text-red-400">
      {outOfStock}
    </h2>

    <p className="mt-2 text-red-400">
      Restock immediately
    </p>

  </div>

</div>

<div className="mt-12">
  <InventoryTable products={products} />
</div>

      </div>

    </main>
  );
}