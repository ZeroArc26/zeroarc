"use client";

import InventoryForm from "./InventoryForm";
import InventorySummary from "./InventorySummary";
import InventoryAlerts from "./InventoryAlerts";

export default function ProductInventory() {
  return (
    <div className="space-y-8">
      <div className="grid gap-8 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <InventoryForm />
        </div>

        <InventorySummary />

        <InventoryAlerts />
      </div>
    </div>
  );
}