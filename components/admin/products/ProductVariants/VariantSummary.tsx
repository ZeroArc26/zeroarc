"use client";

import {
  Boxes,
  Package,
  Activity,
  AlertTriangle,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { VariantSummaryProps } from "./types";

import {
  getActiveVariants,
  getLowestStockVariant,
  getTotalStock,
} from "./utils";

export default function VariantSummary({
  variants,
}: VariantSummaryProps) {

  const totalVariants = variants.length;

  const totalStock =
    getTotalStock(variants);

  const activeVariants =
    getActiveVariants(variants);

  const lowest =
    getLowestStockVariant(variants);

  const cards = [
    {
      title: "Total Variants",
      value: totalVariants,
      icon: Boxes,
    },
    {
      title: "Total Stock",
      value: totalStock,
      icon: Package,
    },
    {
      title: "Active Variants",
      value: `${activeVariants}/${totalVariants}`,
      icon: Activity,
    },
    {
      title: "Lowest Stock",
      value: lowest
        ? `${lowest.color} ${lowest.size} (${lowest.stock})`
        : "--",
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">

      {cards.map((card) => {

        const Icon = card.icon;

        return (
          <Card key={card.title}>

            <CardContent className="flex items-center justify-between p-6">

              <div>

                <p className="text-sm text-muted-foreground">
                  {card.title}
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {card.value}
                </h2>

              </div>

              <div className="rounded-xl bg-violet-500/10 p-3">

                <Icon className="h-6 w-6 text-violet-500" />

              </div>

            </CardContent>

          </Card>
        );

      })}

    </div>
  );
}