"use client";

import { useMemo, useState } from "react";

import CouponToolbar from "./CouponToolbar";
import CouponTable from "./CouponTable";

export default function CouponsPageClient({ coupons }: { coupons: any[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return coupons;
    return coupons.filter((c) => c.code.toLowerCase().includes(q));
  }, [coupons, search]);

  return (
    <div className="space-y-6">
      <CouponToolbar onSearchChange={setSearch} />
      <CouponTable coupons={filtered} />
    </div>
  );
}