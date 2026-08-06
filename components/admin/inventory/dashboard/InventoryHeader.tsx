"use client";

import { Download, RefreshCw, List, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import StockAdjustmentDialog from "../dialogs/StockAdjustmentDialog";

import type { VariantInventoryRow } from "@/lib/actions/inventory/getProductVariantInventory";

interface InventoryHeaderProps {
  showManageButton?: boolean;
  rows?: VariantInventoryRow[];
}

export default function InventoryHeader({
  showManageButton = true,
  rows = [],
}: InventoryHeaderProps) {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  function handleRefresh() {
    setRefreshing(true);
    router.refresh();
    setTimeout(() => setRefreshing(false), 600);
  }

  function handleExport() {
    if (rows.length === 0) {
      alert("No inventory data to export.");
      return;
    }

    const headers = ["Product", "Color", "Size", "SKU", "Stock", "Low Stock Threshold"];
    const csvRows = rows.map((r) =>
      [r.productTitle, r.color, r.size, r.sku, r.stock, r.lowStockThreshold]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );

    const csv = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `inventory-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Inventory Dashboard
        </h1>

        <p className="mt-2 text-muted-foreground">
          Manage inventory, monitor stock movements and keep products available.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" className="gap-2" onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh
        </Button>

        <Button variant="outline" className="gap-2" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Export
        </Button>

        <StockAdjustmentDialog />

        {showManageButton ? (
          <Link href="/admin/dashboard/inventory/all">
            <Button>
              <List className="mr-2 h-4 w-4" />
              Manage Inventory
            </Button>
          </Link>
        ) : (
          <Link href="/admin/dashboard/inventory">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
        )}
      </div>
    </div>
  );
}