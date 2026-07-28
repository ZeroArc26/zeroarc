"use client";

import { Eye, Tag } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CustomerPreviewProps } from "./types";
import { calculateFinalPrice } from "./utils";

export default function CustomerPreview({
  sellingPrice,
  comparePrice,
  discountType,
  discountValue,
}: CustomerPreviewProps) {
  const finalPrice = calculateFinalPrice(
    sellingPrice,
    discountType,
    discountValue
  );

  const customerSaving = Math.max(
    comparePrice - finalPrice,
    0
  );

  const discount =
    comparePrice > 0
      ? Math.round(
          (customerSaving / comparePrice) * 100
        )
      : 0;

  return (
    <Card className="rounded-3xl border border-white/10 bg-[#111113]">

      <CardHeader>

        <CardTitle className="flex items-center gap-3 text-white">

          <Eye className="h-5 w-5 text-violet-400" />

          Customer Preview

        </CardTitle>

      </CardHeader>

      <CardContent>

        <div className="rounded-3xl border border-dashed border-violet-500/20 bg-[#18181b] p-8">

          <div className="space-y-4">

            <div className="flex items-center gap-3">

              <span className="text-4xl font-bold text-white">
                ₹{finalPrice.toFixed(0)}
              </span>

              {discount > 0 && (
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400">
                  {discount}% OFF
                </span>
              )}

            </div>

            {comparePrice > finalPrice && (
              <div className="flex items-center gap-3">

                <span className="text-xl text-zinc-500 line-through">
                  ₹{comparePrice.toFixed(0)}
                </span>

                <span className="flex items-center gap-1 text-sm text-violet-400">

                  <Tag className="h-4 w-4" />

                  You save ₹{customerSaving.toFixed(0)}

                </span>

              </div>
            )}

            <p className="pt-2 text-sm text-zinc-500">
              This is exactly how pricing will appear on the product page.
            </p>

          </div>

        </div>

      </CardContent>

    </Card>
  );
}