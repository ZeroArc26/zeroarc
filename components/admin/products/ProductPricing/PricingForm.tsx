"use client";

import { IndianRupee, CheckCircle2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PricingFormProps } from "./types";

export default function PricingForm({
  sellingPrice,
  comparePrice,
  costPrice,
  taxRate,
  discountType,
  discountValue,
  setSellingPrice,
  setComparePrice,
  setCostPrice,
  setTaxRate,
  setDiscountType,
  setDiscountValue,
}: PricingFormProps) {
  return (
    <Card className="overflow-hidden rounded-3xl border border-white/10 bg-[#111113] shadow-xl">

      <CardHeader className="border-b border-white/10">

        <div className="flex items-start justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">

              <IndianRupee className="h-7 w-7 text-violet-400" />

            </div>

            <div>

              <CardTitle className="text-2xl font-bold text-white">
                Product Pricing
              </CardTitle>

              <CardDescription className="mt-1">
                Configure pricing, taxes and discounts for this product.
              </CardDescription>

            </div>

          </div>

          <Badge className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-emerald-400">

            <CheckCircle2 className="mr-2 h-4 w-4" />

            Auto Saved

          </Badge>

        </div>

      </CardHeader>

      <CardContent className="space-y-8 p-8">

        <div className="grid gap-6 lg:grid-cols-2">

          {/* Selling Price */}

          <div className="space-y-3">

            <Label className="font-medium text-white">
              Selling Price *
            </Label>

            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                ₹
              </span>

              <Input
                type="number"
                value={sellingPrice}
                onChange={(e) =>
                  setSellingPrice(Number(e.target.value))
                }
                placeholder="0.00"
                className="h-14 rounded-2xl border-white/10 bg-[#18181b] pl-10 text-base"
              />

            </div>

            <p className="text-xs text-zinc-500">
              Final price customers will pay.
            </p>

          </div>

          {/* Compare Price */}

          <div className="space-y-3">

            <Label className="font-medium text-white">
              Compare Price (MRP)
            </Label>

            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                ₹
              </span>

              <Input
                type="number"
                value={comparePrice}
                onChange={(e) =>
                  setComparePrice(Number(e.target.value))
                }
                placeholder="0.00"
                className="h-14 rounded-2xl border-white/10 bg-[#18181b] pl-10 text-base"
              />

            </div>

            <p className="text-xs text-zinc-500">
              Displayed as the original MRP on the storefront.
            </p>

          </div>
                    {/* Cost Price */}

          <div className="space-y-3">

            <Label className="font-medium text-white">
              Cost Price
            </Label>

            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                ₹
              </span>

              <Input
                type="number"
                value={costPrice}
                onChange={(e) =>
                  setCostPrice(Number(e.target.value))
                }
                placeholder="0.00"
                className="h-14 rounded-2xl border-white/10 bg-[#18181b] pl-10 text-base"
              />

            </div>

            <p className="text-xs text-zinc-500">
              Used internally to calculate profit margin.
            </p>

          </div>

          {/* Tax Rate */}

          <div className="space-y-3">

            <Label className="font-medium text-white">
              Tax Rate
            </Label>

            <Select
              value={String(taxRate)}
              onValueChange={(value) =>
                setTaxRate(Number(value))
              }
            >

              <SelectTrigger className="h-14 rounded-2xl border-white/10 bg-[#18181b]">

                <SelectValue placeholder="Select Tax Rate" />

              </SelectTrigger>

              <SelectContent>

                <SelectItem value="0">GST 0%</SelectItem>
                <SelectItem value="5">GST 5%</SelectItem>
                <SelectItem value="12">GST 12%</SelectItem>
                <SelectItem value="18">GST 18%</SelectItem>
                <SelectItem value="28">GST 28%</SelectItem>

              </SelectContent>

            </Select>

          </div>

          {/* Discount Type */}

          <div className="space-y-3">

            <Label className="font-medium text-white">
              Discount Type
            </Label>

            <Select
              value={discountType}
              onValueChange={(value) =>
                setDiscountType(value as "percentage" | "fixed")
              }
            >

              <SelectTrigger className="h-14 rounded-2xl border-white/10 bg-[#18181b]">

                <SelectValue />

              </SelectTrigger>

              <SelectContent>

                <SelectItem value="percentage">
                  Percentage (%)
                </SelectItem>

                <SelectItem value="fixed">
                  Fixed Amount (₹)
                </SelectItem>

              </SelectContent>

            </Select>

          </div>

          {/* Discount Value */}

          <div className="space-y-3">

            <Label className="font-medium text-white">
              Discount Value
            </Label>

            <Input
              type="number"
              value={discountValue}
              onChange={(e) =>
                setDiscountValue(Number(e.target.value))
              }
              placeholder="0"
              className="h-14 rounded-2xl border-white/10 bg-[#18181b] text-base"
            />

          </div>

        </div>

        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 px-5 py-4">

          <p className="text-sm text-violet-300">
            ✨ Changes are saved automatically. Your storefront pricing updates after you publish the product.
          </p>

        </div>

      </CardContent>

    </Card>
  );
}