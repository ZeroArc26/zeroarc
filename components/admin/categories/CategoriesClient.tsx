"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

import CategoryTable from "./CategoryTable";

interface CategoriesClientProps {
  categories: any[];
}

export default function CategoriesClient({
  categories,
}: CategoriesClientProps) {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories..."
          className="h-11 border-zinc-800 bg-zinc-900 pl-10 text-white placeholder:text-zinc-500 focus-visible:ring-violet-500"
        />
      </div>

      {/* Table */}
      <CategoryTable categories={categories} search={search} />
    </div>
  );
}