"use client";

import { useMemo, useState } from "react";

import InventoryTableToolbar from "./InventoryTableToolbar";
import InventoryTable from "./InventoryTable";

import type { VariantInventoryRow } from "@/lib/actions/inventory/getProductVariantInventory";

interface Props {
  rows: VariantInventoryRow[];
}

export default function InventoryListClient({ rows }: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter(
      (r) =>
        r.productTitle.toLowerCase().includes(q) ||
        r.sku.toLowerCase().includes(q) ||
        r.color.toLowerCase().includes(q)
    );
  }, [rows, search]);

  return (
    <div className="space-y-6">
      <InventoryTableToolbar search={search} onSearchChange={setSearch} />
      <InventoryTable rows={filtered} />
    </div>
  );
}