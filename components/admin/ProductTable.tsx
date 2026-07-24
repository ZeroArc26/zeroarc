"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import ProductDrawer from "./ProductDrawer";

interface Product {
  _id: string;
  title: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
}

interface Props {
  products: Product[];
}

export default function ProductTable({ products }: Props) {
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

const [drawerOpen, setDrawerOpen] = useState(false);
    async function handleBulkDelete() {
  if (selectedProducts.length === 0) return;

  const confirmDelete = window.confirm(
    `Delete ${selectedProducts.length} selected products?`
  );

  if (!confirmDelete) return;

  try {
    const res = await fetch("/api/products/bulk-delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ids: selectedProducts,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    alert("✅ Products deleted successfully.");

    window.location.reload();

  } catch (error) {
    console.error(error);

    alert("❌ Failed to delete products.");
  }
}
  return (
    <>
    <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/40">

        {selectedProducts.length > 0 && (

  <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6 py-4">

    <p className="font-semibold text-white">
      {selectedProducts.length} Product
      {selectedProducts.length > 1 ? "s" : ""} Selected
    </p>

    <div className="flex gap-3">

      <button
  onClick={handleBulkDelete}
  className="rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold transition hover:bg-red-700"
>
  Delete Selected
</button>

      <button
        className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold transition hover:bg-violet-700"
      >
        Feature Selected
      </button>

    </div>

  </div>

)}

      <table className="w-full">

        <thead className="border-b border-zinc-800">

          <tr className="text-left text-zinc-400">

            <th className="px-4 py-5">
             <input
  type="checkbox"
  checked={
    products.length > 0 &&
    selectedProducts.length === products.length
  }
  onChange={(e) => {
    if (e.target.checked) {
      setSelectedProducts(
        products.map((product) => product._id)
      );
    } else {
      setSelectedProducts([]);
    }
  }}
  className="h-4 w-4 accent-violet-600"
/>
            </th>

            <th className="px-6 py-5">Image</th>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th className="text-center">Actions</th>

          </tr>

        </thead>

        <tbody>

          {products.map((product) => (

            <tr
  key={product._id}
  onClick={() => {
    setSelectedProduct(product);
    setDrawerOpen(true);
  }}
  className="cursor-pointer border-b border-zinc-800 transition hover:bg-zinc-800/30"
>

<td className="px-4 py-4">

  <input
    type="checkbox"
    checked={selectedProducts.includes(product._id)}
    onClick={(e) => e.stopPropagation()}
onChange={() => {
      if (selectedProducts.includes(product._id)) {
        setSelectedProducts(
          selectedProducts.filter(
            (id) => id !== product._id
          )
        );
      } else {
        setSelectedProducts([
          ...selectedProducts,
          product._id,
        ]);
      }
    }}
    className="h-4 w-4 accent-violet-600"
  />

</td>

              <td className="px-6 py-4">

                <Image
                  src={product.images[0]}
                  alt={product.title}
                  width={60}
                  height={60}
                  className="rounded-xl object-cover"
                />

              </td>

              <td className="font-semibold">
                {product.title}
              </td>

              <td>{product.category}</td>

              <td>₹{product.price}</td>

              <td>{product.stock}</td>

              <td>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    product.stock > 10
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {product.stock > 10 ? "Active" : "Low Stock"}
                </span>
              </td>

              <td>

                <div className="flex justify-center gap-3">

                  <Link
  href={`/admin/products/edit/${product._id}`}
  onClick={(e) => e.stopPropagation()}
  className="rounded-lg p-2 transition hover:bg-zinc-800"
>
                 <Pencil size={18} />
                </Link>

                  <button
  onClick={(e) => {
    e.stopPropagation();
    // Delete logic baad me add karenge
  }}
  className="text-red-400"
>
                    <Trash2 size={18} />
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

          <ProductDrawer
  product={selectedProduct}
  open={drawerOpen}
  onClose={() => {
    setDrawerOpen(false);
    setSelectedProduct(null);
  }}
/>

</>
    
  );
}