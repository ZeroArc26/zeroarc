"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";

import { useWishlistStore } from "@/stores/wishlistStore";
import { useCartStore } from "@/stores/cartStore";

import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";
import AccountSidebar from "@/components/account/AccountSidebar";

export default function WishlistPage() {
  const storeItems = useWishlistStore((state) => state.items);
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
  const addToCart = useCartStore((state) => state.addToCart);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Wishlist is persisted in localStorage — gate behind `mounted` to
  // avoid a server/client hydration mismatch.
  const items = mounted ? storeItems : [];

  const handleMoveToCart = (item: (typeof items)[number]) => {
    addToCart({
      productId: item.productId,
      slug: item.slug,
      title: item.title,
      image: item.image,
      color: item.color,
      size: item.size,
      price: item.price,
      quantity: 1,
      stock: item.stock,
      addedAt: new Date().toISOString(),
    });
    removeFromWishlist(item.productId);
  };

  return (
    <main className="min-h-screen bg-zinc-50">
      <AnnouncementBar />
      <Navbar />

      <div className="mx-auto max-w-[1400px] px-6 py-8 md:px-14">
        <h1 className="flex items-center gap-2 text-2xl font-black uppercase text-black">
          My Wishlist
          <span className="text-violet-600">({items.length})</span>
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Items you&apos;ve saved for later.
        </p>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          <AccountSidebar />

          <div className="flex-1">
            {items.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 bg-white p-16 text-center">
                <Heart className="mx-auto h-10 w-10 text-zinc-300" />
                <h2 className="mt-4 text-xl font-bold text-black">
                  Your wishlist is empty
                </h2>
                <p className="mt-2 text-zinc-500">
                  Save items you love so you can find them later.
                </p>
                <Link
                  href="/men"
                  className="mt-6 inline-block rounded-xl bg-violet-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="rounded-2xl border border-zinc-200 bg-white p-4"
                  >
                    <Link
                      href={`/products/${item.slug}`}
                      className="relative block aspect-square overflow-hidden rounded-xl bg-zinc-100"
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="280px"
                        className="object-cover"
                      />
                    </Link>

                    <div className="mt-3">
                      <Link href={`/products/${item.slug}`}>
                        <h3 className="text-sm font-semibold text-black hover:text-violet-600">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="mt-1 text-xs text-zinc-500">
                        Size: {item.size} • Color: {item.color}
                      </p>
                      <p className="mt-1 text-sm font-bold text-black">
                        ₹{item.price}
                      </p>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        disabled={item.stock <= 0}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-violet-600 py-2.5 text-xs font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-zinc-300"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        {item.stock > 0 ? "Move to Cart" : "Out of Stock"}
                      </button>

                      <button
                        onClick={() => removeFromWishlist(item.productId)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-200 text-zinc-500 transition hover:border-red-300 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Newsletter />
      <Footer />
    </main>
  );
}