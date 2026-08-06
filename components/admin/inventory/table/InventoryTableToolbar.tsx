"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function InventoryTableToolbar({ search, onSearchChange }: Props) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search product, SKU, or color..."
          className="pl-9"
        />
      </div>
    </div>
  );
}