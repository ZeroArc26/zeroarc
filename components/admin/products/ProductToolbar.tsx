"use client";

import Link from "next/link";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProductToolbar() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
      <Link href="/admin/dashboard/products/new">
        <Button className="h-11 gap-2 rounded-xl bg-violet-600 px-5 hover:bg-violet-700">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </Link>

      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

        <Input
          placeholder="Search products..."
          className="h-11 border-zinc-800 bg-zinc-900 pl-10 text-white placeholder:text-zinc-500 focus-visible:ring-violet-500"
        />
      </div>
    </div>
  );
}