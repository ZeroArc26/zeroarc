"use client";

import InventoryForm from "./ProductInventory/InventoryForm";
import InventorySummary from "./ProductInventory/InventorySummary";
import InventoryAlerts from "./ProductInventory/InventoryAlerts";

export default function ProductInventory() {
  return (
    <div className="grid gap-8 xl:grid-cols-3">

      {/* Left */}

      <div className="xl:col-span-2">
        <InventoryForm />
      </div>

      {/* Right */}

      <div className="space-y-6">
        <InventorySummary />
        <InventoryAlerts />
      </div>

    </div>
  );
}