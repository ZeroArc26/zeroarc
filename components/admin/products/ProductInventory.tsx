"use client";

import { useMemo, useState } from "react";

import InventoryForm from "./ProductInventory/InventoryForm";
import InventorySummary from "./ProductInventory/InventorySummary";
import InventoryAlerts from "./ProductInventory/InventoryAlerts";

import { calculateAvailableStock } from "./ProductInventory/utils";

export default function ProductInventory() {
  const [sku, setSku] = useState("ZA-TSH-000001");
  const [barcode, setBarcode] = useState("8901234567891");

  const [stockQuantity, setStockQuantity] = useState(250);
  const [reservedStock] = useState(12);

  const [lowStockAlert, setLowStockAlert] = useState(20);
  const [reorderLevel, setReorderLevel] = useState(50);

  const [trackInventory, setTrackInventory] = useState(true);
  const [continueSelling, setContinueSelling] = useState(false);

  const availableStock = useMemo(
    () =>
      calculateAvailableStock(
        stockQuantity,
        reservedStock
      ),
    [stockQuantity, reservedStock]
  );

  return (
    <div className="grid gap-8 xl:grid-cols-3">

      {/* Left Side - Inventory Form */}

      <div className="xl:col-span-2">
        <InventoryForm
          sku={sku}
          barcode={barcode}
          stockQuantity={stockQuantity}
          lowStockAlert={lowStockAlert}
          reorderLevel={reorderLevel}
          trackInventory={trackInventory}
          continueSelling={continueSelling}
          setSku={setSku}
          setBarcode={setBarcode}
          setStockQuantity={setStockQuantity}
          setLowStockAlert={setLowStockAlert}
          setReorderLevel={setReorderLevel}
          setTrackInventory={setTrackInventory}
          setContinueSelling={setContinueSelling}
        />
      </div>

      {/* Right Side - Summary + Alerts */}

      <div className="space-y-6">

        <InventorySummary
          stockQuantity={stockQuantity}
          reservedStock={reservedStock}
          availableStock={availableStock}
          lowStockAlert={lowStockAlert}
          reorderLevel={reorderLevel}
        />

        <InventoryAlerts
          sku={sku}
          barcode={barcode}
          stockQuantity={stockQuantity}
          lowStockAlert={lowStockAlert}
          reorderLevel={reorderLevel}
          trackInventory={trackInventory}
        />

      </div>

    </div>
  );
}