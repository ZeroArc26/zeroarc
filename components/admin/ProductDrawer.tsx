"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  _id: string;
  title: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
}

interface Props {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export default function ProductDrawer({
  product,
  open,
  onClose,
}: Props) {

    const [selectedImage, setSelectedImage] = useState(0);

useEffect(() => {
  setSelectedImage(0);
}, [product]);
  return (
    <>
      {/* Overlay */}

      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 transition ${
          open
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
      />

      {/* Drawer */}

      <aside
  className={`fixed right-0 top-0 z-50 flex h-screen w-[480px] flex-col border-l border-zinc-800 bg-[#0B0B0D] transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {product && (
          <>
            {/* Header */}

            <div className="flex items-center justify-between border-b border-zinc-800 p-6">

              <h2 className="text-2xl font-black text-white">
                Product Details
              </h2>

              <button onClick={onClose}>
                <X className="text-zinc-400 hover:text-white" />
              </button>

            </div>

            {/* Content */}

            <div className="flex-1 space-y-6 overflow-y-auto p-6">

              <div className="space-y-4">

  <Image
    src={product.images[selectedImage]}
    alt={product.title}
    width={400}
    height={400}
    className="h-[380px] w-full rounded-3xl object-cover"
  />

  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">

    {product.images.map((image, index) => (

      <button
        key={index}
        onClick={() => setSelectedImage(index)}
        className={`overflow-hidden rounded-xl border-2 transition ${
          selectedImage === index
            ? "border-violet-500"
            : "border-zinc-700"
        }`}
      >

        <Image
          src={image}
          alt=""
          width={70}
          height={70}
          className="h-[70px] w-[70px] object-cover"
        />

      </button>

    ))}

  </div>

</div>

              <div>

  <div className="mb-3 flex items-center gap-3">

    <span className="rounded-full bg-violet-600/20 px-3 py-1 text-xs font-bold text-violet-400">
      {product.category}
    </span>

    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        product.stock > 10
          ? "bg-green-500/20 text-green-400"
          : "bg-red-500/20 text-red-400"
      }`}
    >
      {product.stock > 10 ? "In Stock" : "Low Stock"}
    </span>

  </div>

  <h1 className="text-3xl font-black leading-tight">
    {product.title}
  </h1>

</div>

              <div className="grid grid-cols-2 gap-4">

  <div className="rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10 p-5">

    <p className="text-xs uppercase tracking-wider text-zinc-400">
      Price
    </p>

    <h2 className="mt-2 text-3xl font-black text-violet-400">
      ₹{product.price}
    </h2>

  </div>

  <div className="rounded-3xl border border-zinc-700 bg-zinc-900 p-5">

    <p className="text-xs uppercase tracking-wider text-zinc-400">
      Stock
    </p>

    <h2 className="mt-2 text-3xl font-black">
      {product.stock}
    </h2>

  </div>

</div>


<div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-5">

  <h3 className="mb-5 text-lg font-bold">
    Product Information
  </h3>

  <div className="space-y-4">

    <div className="flex justify-between">

      <span className="text-zinc-500">
        Product ID
      </span>

      <span className="font-semibold">
        {product._id.slice(-8).toUpperCase()}
      </span>

    </div>

    <div className="flex justify-between">

      <span className="text-zinc-500">
        Category
      </span>

      <span className="font-semibold">
        {product.category}
      </span>

    </div>

    <div className="flex justify-between">

      <span className="text-zinc-500">
        Status
      </span>

      <span
        className={`font-semibold ${
          product.stock > 10
            ? "text-green-400"
            : "text-red-400"
        }`}
      >
        {product.stock > 10
          ? "Available"
          : "Low Stock"}
      </span>

    </div>

  </div>

</div>

<div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-5">

  <h3 className="mb-5 text-lg font-bold">
    Quick Stats
  </h3>

  <div className="grid grid-cols-2 gap-4">

    <div className="rounded-2xl bg-zinc-950 p-4">

      <p className="text-xs text-zinc-500">
        Total Sold
      </p>

      <h2 className="mt-2 text-2xl font-black">
        0
      </h2>

    </div>

    <div className="rounded-2xl bg-zinc-950 p-4">

      <p className="text-xs text-zinc-500">
        Revenue
      </p>

      <h2 className="mt-2 text-2xl font-black text-green-400">
        ₹0
      </h2>

    </div>

    <div className="rounded-2xl bg-zinc-950 p-4">

      <p className="text-xs text-zinc-500">
        Views
      </p>

      <h2 className="mt-2 text-2xl font-black">
        0
      </h2>

    </div>

    <div className="rounded-2xl bg-zinc-950 p-4">

      <p className="text-xs text-zinc-500">
        Wishlist
      </p>

      <h2 className="mt-2 text-2xl font-black text-pink-400">
        0
      </h2>

    </div>

  </div>

</div>

              <div className="sticky bottom-0 -mx-6 mt-6 space-y-3 border-t border-zinc-800 bg-[#0B0B0D] px-6 py-6">

  <Link
  href={`/admin/dashboard/products/${product._id}`}
  className="block w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 text-center font-bold transition hover:scale-[1.02]"
>
  ✏ Edit Product
</Link>

  <button className="w-full rounded-2xl bg-red-600 py-4 font-bold transition hover:bg-red-700">
    🗑 Delete Product
  </button>

</div>

            </div>
          </>
        )}
      </aside>
    </>
  );
}