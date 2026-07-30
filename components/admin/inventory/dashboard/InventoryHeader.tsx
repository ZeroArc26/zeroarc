"use client";

import { Download, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { List } from "lucide-react";

interface InventoryHeaderProps {
  showManageButton?: boolean;
}

export default function InventoryHeader({
  showManageButton = true,
}: InventoryHeaderProps) {
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
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => console.log("Refresh Inventory")}
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>

        <Button
          variant="outline"
          className="gap-2"
          onClick={() => console.log("Export Inventory")}
        >
          <Download className="h-4 w-4" />
          Export
        </Button>

        <Button
          className="gap-2"
          onClick={() => console.log("Stock Adjustment")}
        >
          <Plus className="h-4 w-4" />
          Stock Adjustment
        </Button>

        {showManageButton ? (
  <Link href="/admin/dashboard/inventory/all">
    <Button>
      <List className="mr-2 h-4 w-4" />
      Manage Inventory
    </Button>
  </Link>
) : (
  <Link href="/admin/dashboard/inventory">
    <Button variant="outline">
      ← Back to Dashboard
    </Button>
  </Link>
)}
      </div>
    </div>
  );
}