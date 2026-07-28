"use client";

import { useFormContext } from "react-hook-form";

import {
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";

export default function InventoryAlerts() {
  const { watch } = useFormContext();

  const sku = watch("inventory.sku") ?? "";
  const barcode = watch("inventory.barcode") ?? "";

  const stockQuantity =
    watch("inventory.quantity") ?? 0;

  const lowStockAlert =
    watch("inventory.lowStockThreshold") ?? 5;

  const reorderLevel =
    watch("inventory.reorderLevel") ?? 10;

  const trackInventory =
    watch("inventory.trackInventory") ?? true;

  const alerts: string[] = [];

  if (!sku.trim()) {
    alerts.push("SKU has not been generated.");
  }

  if (!barcode.trim()) {
    alerts.push("Barcode has not been generated.");
  }

  if (trackInventory && stockQuantity <= 0) {
    alerts.push("This product is currently out of stock.");
  }

  if (
    trackInventory &&
    stockQuantity > 0 &&
    stockQuantity <= lowStockAlert
  ) {
    alerts.push(
      "Stock has reached the low stock alert level."
    );
  }

  if (
    trackInventory &&
    reorderLevel > 0 &&
    stockQuantity <= reorderLevel
  ) {
    alerts.push(
      "It's recommended to reorder this product now."
    );
  }

  if (!trackInventory) {
    alerts.push(
      "Inventory tracking is disabled."
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