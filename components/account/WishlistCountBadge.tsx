"use client";

import { useEffect, useState } from "react";
import { useWishlistStore } from "@/stores/wishlistStore";

export default function WishlistCountBadge() {
  const items = useWishlistStore((state) => state.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return <>{mounted ? items.length : 0}</>;
}