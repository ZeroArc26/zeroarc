"use client";

import { useMemo, useState } from "react";

import InventoryForm from "./InventoryForm";
import InventorySummary from "./InventorySummary";
import InventoryAlerts from "./InventoryAlerts";

import { calculateAvailableStock } from "./utils";

export default function ProductInventory() {

  const [sku] = useState("ZA-TSH-BLK-M-000001");

  const [barcode] = useState("8901234567891");

  const [stockQuantity, setStockQuantity] = useState(250);

  const [reservedStock] = useState(12);

  const [lowStockAlert, setLowStockAlert] = useState(20);

  const [reorderLevel, setReorderLevel] = useState(50);

  const [trackInventory, setTrackInventory] =
    useState(true);

  const [continueSelling, setContinueSelling] =
    useState(false);

  const availableStock = useMemo(
    () =>
      calculateAvailableStock(
        stockQuantity,
        reservedStock
      ),
    [stockQuantity, reservedStock]
  );

  return (

    <div className="space-y-8">

      <div className="grid gap-8 xl:grid-cols-3">

        <div className="xl:col-span-2">

          <InventoryForm
            sku={sku}
            barcode={barcode}
            stockQuantity={stockQuantity}
            lowStockAlert={lowStockAlert}
            reorderLevel={reorderLevel}
            trackInventory={trackInventory}
            continueSelling={continueSelling}
            setSku={() => {}}
            setBarcode={() => {}}
            setStockQuantity={setStockQuantity}
            setLowStockAlert={setLowStockAlert}
            setReorderLevel={setReorderLevel}
            setTrackInventory={setTrackInventory}
            setContinueSelling={setContinueSelling}
          />

        </div>

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