"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  onSearchChange: (value: string) => void;
}

export default function CouponToolbar({ onSearchChange }: Props) {
  const [value, setValue] = useState("");

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onSearchChange(e.target.value);
          }}
          placeholder="Search coupon code..."
          className="h-11 border-zinc-800 bg-zinc-900 pl-10 text-white placeholder:text-zinc-500"
        />
      </div>

      <Link href="/admin/dashboard/coupons/new">
        <Button className="h-11 gap-2 rounded-xl bg-violet-600 px-5 hover:bg-violet-700">
          <Plus className="h-4 w-4" />
          Create Coupon
        </Button>
      </Link>
    </div>
  );
}