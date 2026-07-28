"use client";

import {
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";

import { PricingWarningsProps } from "./types";

export default function PricingWarnings({
  sellingPrice,
  comparePrice,
  costPrice,
  margin,
}: PricingWarningsProps) {
  const warnings: string[] = [];

  if (sellingPrice <= 0) {
    warnings.push("Selling price must be greater than ₹0.");
  }

  if (
    comparePrice > 0 &&
    comparePrice <= sellingPrice
  ) {
    warnings.push(
      "Compare Price (MRP) should be greater than Selling Price."
    );
  }

  if (
    costPrice > 0 &&
    sellingPrice < costPrice
  ) {
    warnings.push(
      "Selling below cost price will result in a loss."
    );
  }

  if (
    margin > 0 &&
    margin < 20
  ) {
    warnings.push(
      "Profit margin is lower than the recommended 20%."
    );
  }

  if (warnings.length === 0) {
    return (
      <Alert className="rounded-2xl border-emerald-500/20 bg-emerald-500/10">
        <CheckCircle2 className="h-4 w-4 text-emerald-400" />

        <AlertDescription className="text-emerald-300">
          Pricing looks good. No issues detected.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="rounded-2xl border-yellow-500/20 bg-yellow-500/10">
      <AlertTriangle className="h-4 w-4 text-yellow-400" />

      <AlertDescription>
        <ul className="space-y-2 text-sm text-yellow-300">
          {warnings.map((warning) => (
            <li key={warning}>
              • {warning}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}