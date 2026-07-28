"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { VariantAlertsProps } from "./types";

export default function VariantAlerts({
  variants,
}: VariantAlertsProps) {
  const alerts: string[] = [];

  /* ----------------------------- */
  /* Duplicate Color + Size        */
  /* ----------------------------- */

  const combinations = new Set<string>();

  variants.forEach((variant) => {
    const key = `${variant.color}-${variant.size}`;

    if (combinations.has(key)) {
      alerts.push(
        `Duplicate variant found (${variant.color} ${variant.size}).`
      );
    }

    combinations.add(key);
  });

  /* ----------------------------- */
  /* Duplicate SKU                 */
  /* ----------------------------- */

  const skuSet = new Set<string>();

  variants.forEach((variant) => {
    if (skuSet.has(variant.sku)) {
      alerts.push(`Duplicate SKU: ${variant.sku}`);
    }

    skuSet.add(variant.sku);
  });

  /* ----------------------------- */
  /* Low Stock                     */
  /* ----------------------------- */

  variants.forEach((variant) => {
    if (variant.stock <= 10) {
      alerts.push(
        `${variant.color} ${variant.size} is running low (${variant.stock} left).`
      );
    }
  });

  /* ----------------------------- */
  /* Inactive                      */
  /* ----------------------------- */

  const inactive = variants.filter(
    (variant) => !variant.isActive
  ).length;

  if (inactive) {
    alerts.push(
      `${inactive} inactive variant${
        inactive > 1 ? "s" : ""
      }.`
    );
  }

  return (
    <Card>

      <CardHeader>

        <CardTitle>
          Variant Alerts
        </CardTitle>

      </CardHeader>

      <CardContent>

        {!alerts.length ? (
          <div className="flex items-center gap-3 rounded-lg border border-green-500/20 bg-green-500/10 p-4">

            <CheckCircle2 className="h-5 w-5 text-green-500" />

            <p className="text-sm">
              Everything looks good. No issues found.
            </p>

          </div>
        ) : (
          <div className="space-y-3">

            {alerts.map((alert, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4"
              >
                <AlertTriangle className="mt-0.5 h-5 w-5 text-yellow-500" />

                <p className="text-sm">
                  {alert}
                </p>
              </div>
            ))}

          </div>
        )}

      </CardContent>

    </Card>
  );
}