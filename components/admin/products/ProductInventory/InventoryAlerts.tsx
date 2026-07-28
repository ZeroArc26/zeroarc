"use client";

import {
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";

import { InventoryAlertsProps } from "./types";

export default function InventoryAlerts({
  sku,
  barcode,
  stockQuantity,
  lowStockAlert,
  reorderLevel,
  trackInventory,
}: InventoryAlertsProps) {

  const alerts: string[] = [];

  if (!sku.trim()) {
    alerts.push("SKU could not be generated.");
  }

  if (!barcode.trim()) {
    alerts.push("Barcode could not be generated.");
  }

  if (stockQuantity <= 0 && trackInventory) {
    alerts.push("This product is currently out of stock.");
  }

  if (
    stockQuantity > 0 &&
    stockQuantity <= lowStockAlert
  ) {
    alerts.push("Stock has reached the low stock alert level.");
  }

  if (
    reorderLevel > 0 &&
    stockQuantity <= reorderLevel
  ) {
    alerts.push("It's recommended to reorder this product now.");
  }

  if (!trackInventory) {
    alerts.push(
      "Inventory tracking is disabled for this product."
    );
  }

  if (alerts.length === 0) {
    return (
      <Alert className="rounded-2xl border-emerald-500/20 bg-emerald-500/10">

        <CheckCircle2 className="h-4 w-4 text-emerald-400" />

        <AlertDescription className="text-emerald-300">
          Inventory looks healthy. No issues detected.
        </AlertDescription>

      </Alert>
    );
  }

  return (
    <Alert className="rounded-2xl border-yellow-500/20 bg-yellow-500/10">

      <AlertTriangle className="h-4 w-4 text-yellow-400" />

      <AlertDescription>

        <ul className="space-y-2 text-sm text-yellow-300">

          {alerts.map((alert) => (
            <li key={alert}>
              • {alert}
            </li>
          ))}

        </ul>

      </AlertDescription>

    </Alert>
  );
}