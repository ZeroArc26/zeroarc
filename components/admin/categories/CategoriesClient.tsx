"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";

import { Search } from "lucide-react";

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

      <div className="relative">

        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        />

        <Input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search categories..."
          className="pl-10"
        />

      </div>


      {/* Table */}

      <CategoryTable
        categories={categories}
        search={search}
      />

    </div>
  );
}