"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

import { RotateCcw, Download } from "lucide-react";

import { Search, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import AddInventoryDialog from "../dialogs/AddInventoryDialog";

interface InventoryTableToolbarProps {}

export default function InventoryTableToolbar() {
  const [search, setSearch] = useState("");
  
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  placeholder="Search product or SKU..."
  className="pl-9"
/>
      </div>

      <AddInventoryDialog />
    </div>
  );
}