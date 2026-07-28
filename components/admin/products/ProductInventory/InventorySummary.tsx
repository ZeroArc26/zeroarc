"use client";

import { useFormContext } from "react-hook-form";

import {
  Boxes,
  PackageCheck,
  ShieldCheck,
  Warehouse,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getStockStatus } from "./utils";

export default function InventorySummary() {
  const { watch } = useFormContext();

  const stockQuantity = Number(
  watch("inventory.quantity")
);

const lowStockAlert = Number(
  watch("inventory.lowStockThreshold")
);

const reorderLevel = Number(
  watch("inventory.reorderLevel")
);

const safeStockQuantity = Number.isFinite(stockQuantity)
  ? stockQuantity
  : 0;

const safeLowStockAlert = Number.isFinite(lowStockAlert)
  ? lowStockAlert
  : 5;

const safeReorderLevel = Number.isFinite(reorderLevel)
  ? reorderLevel
  : 10;

  // Reserved stock future orders se aayega
  const reservedStock = 0;

  const availableStock =
  safeStockQuantity - reservedStock;

  const stockStatus =
    getStockStatus(availableStock);

  const stats = [
    {
      title: "Available Stock",
      value: safeStockQuantity,
      icon: PackageCheck,
    },
    {
      title: "Reserved Stock",
      value: reservedStock,
      icon: Boxes,
    },
    {
      title: "Total Stock",
      value: stockQuantity,
      icon: Warehouse,
    },
  ];

  return (
    <Card className="rounded-3xl border border-white/10 bg-[#111113] shadow-xl">

      <CardHeader className="pb-2">

        <CardTitle className="flex items-center gap-3 text-xl font-semibold text-white">

          <ShieldCheck className="h-6 w-6 text-violet-400" />

          Live Inventory

        </CardTitle>

      </CardHeader>

      <CardContent className="space-y-6">

        <div className="space-y-4">
                    {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#18181b] p-5 transition-all duration-300 hover:border-violet-500/30 hover:bg-[#1d1d21]"
              >
                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10">
                    <Icon className="h-5 w-5 text-violet-400" />
                  </div>

                  <div>
                    <p className="text-sm text-zinc-400">
                      {item.title}
                    </p>

                    <h3 className="mt-1 text-3xl font-bold text-white">
                      {item.value}
                    </h3>
                  </div>

                </div>
              </div>
            );
          })}
        </div>





        {/* ================= Stock Health ================= */}

        <div className="rounded-2xl border border-white/10 bg-[#18181b] p-6">

          <div className="mb-4 flex items-center justify-between">

            <span className="text-sm font-medium text-zinc-400">
              Stock Health
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                stockStatus.color === "green"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : stockStatus.color === "yellow"
                  ? "bg-yellow-500/10 text-yellow-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {stockStatus.label}
            </span>

          </div>

          <div className="h-3 overflow-hidden rounded-full bg-white/10">

            <div
              className={`h-full rounded-full transition-all duration-700 ${
                stockStatus.color === "green"
                  ? "bg-emerald-500"
                  : stockStatus.color === "yellow"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{
                width: `${stockStatus.progress}%`,
              }}
            />

          </div>

          <p className="mt-4 text-sm text-zinc-500">

            {stockStatus.color === "green"
              ? "Inventory is healthy and ready for sales."
              : stockStatus.color === "yellow"
              ? "Inventory is getting low. Consider restocking soon."
              : "Inventory is critically low. Immediate restocking is recommended."}

          </p>

        </div>





        {/* ================= Threshold ================= */}

        <div className="grid gap-4 sm:grid-cols-2">

          <div className="rounded-2xl border border-white/10 bg-[#18181b] p-5">

            <p className="text-sm text-zinc-400">
              Low Stock Alert
            </p>

            <h3 className="mt-2 text-2xl font-bold text-white">
              {safeLowStockAlert}
            </h3>

          </div>

          <div className="rounded-2xl border border-white/10 bg-[#18181b] p-5">

            <p className="text-sm text-zinc-400">
              Reorder Level
            </p>

            <h3 className="mt-2 text-2xl font-bold text-white">
              {safeReorderLevel}
            </h3>

          </div>

        </div>

      </CardContent>

    </Card>
  );
}