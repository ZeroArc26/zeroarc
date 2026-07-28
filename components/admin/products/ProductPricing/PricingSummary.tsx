"use client";

import {
  TrendingUp,
  BadgeIndianRupee,
  Wallet,
  ShieldCheck,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { PricingSummaryProps } from "./types";
import { getMarginStatus } from "./utils";

export default function PricingSummary({
  profit,
  margin,
  customerSavings,
  breakEvenPrice,
}: PricingSummaryProps) {
  const status = getMarginStatus(margin);

  const items = [
    {
      label: "Profit",
      value: `₹${profit.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-emerald-400",
    },
    {
      label: "Margin",
      value: `${margin}%`,
      icon: Wallet,
      color: "text-violet-400",
    },
    {
      label: "Customer Saves",
      value: `₹${customerSavings.toFixed(2)}`,
      icon: BadgeIndianRupee,
      color: "text-sky-400",
    },
    {
      label: "Break-even",
      value: `₹${breakEvenPrice.toFixed(2)}`,
      icon: ShieldCheck,
      color: "text-orange-400",
    },
  ];

  return (
    <Card className="rounded-3xl border border-white/10 bg-[#111113]">
      <CardHeader>

        <CardTitle className="flex items-center justify-between">

          <span className="text-xl font-semibold text-white">
            Live Business Summary
          </span>

          <span className={`${status.color} text-sm font-medium`}>
            {status.label}
          </span>

        </CardTitle>

      </CardHeader>

      <CardContent className="space-y-6">

        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5">
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>

                <span className="text-zinc-400">
                  {item.label}
                </span>

              </div>

              <span className={`text-xl font-bold ${item.color}`}>
                {item.value}
              </span>

            </div>
          );
        })}

        <div className="space-y-2">

          <div className="flex items-center justify-between text-sm">

            <span className="text-zinc-500">
              Margin Quality
            </span>

            <span className={status.color}>
              {status.label}
            </span>

          </div>

          <div className="h-3 overflow-hidden rounded-full bg-zinc-800">

            <div
              className="h-full rounded-full bg-violet-500 transition-all duration-700"
              style={{
                width: `${status.progress}%`,
              }}
            />

          </div>

        </div>

      </CardContent>
    </Card>
  );
}