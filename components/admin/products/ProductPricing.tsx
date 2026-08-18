"use client";

import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import type { ProductFormValues } from "@/lib/validations/product.schema";

import PricingForm from "./ProductPricing/PricingForm";
import PricingSummary from "./ProductPricing/PricingSummary";
import CustomerPreview from "./ProductPricing/CustomerPreview";
import PricingWarnings from "./ProductPricing/PricingWarnings";

import {
  calculateProfit,
  calculateMargin,
  calculateCustomerSavings,
  calculateBreakEvenPrice,
} from "./ProductPricing/utils";

export default function ProductPricing() {
  const { watch, setValue } = useFormContext<ProductFormValues>();

  // Reads directly from the real form state (which starts as the
  // product's actual saved pricing in edit mode) instead of hardcoded
  // local defaults — that mismatch was the bug: this section always
  // showed ₹1299/₹1999/₹650/18%/35% regardless of what was actually
  // saved, and editing any field risked overwriting real data with
  // numbers derived from those wrong starting values.
  const sellingPrice = watch("pricing.sellingPrice") ?? 0;
  const comparePrice = watch("pricing.comparePrice") ?? 0;
  const costPrice = watch("pricing.costPrice") ?? 0;
  const taxClass = watch("pricing.taxClass") ?? "GST 18%";
  const taxRate = parseInt(taxClass.replace(/\D/g, ""), 10) || 0;
  const rawDiscountType = watch("pricing.discountType") ?? "percentage";
  const discountType: "percentage" | "fixed" =
    rawDiscountType === "fixed" ? "fixed" : "percentage";
  const discountValue = watch("pricing.discountValue") ?? 0;

  const setSellingPrice = (value: number) =>
    setValue("pricing.sellingPrice", value, { shouldDirty: true });

  const setComparePrice = (value: number) =>
    setValue("pricing.comparePrice", value, { shouldDirty: true });

  const setCostPrice = (value: number) =>
    setValue("pricing.costPrice", value, { shouldDirty: true });

  const setTaxRate = (value: number) =>
    setValue("pricing.taxClass", `GST ${value}%`, { shouldDirty: true });

  const setDiscountType = (value: "percentage" | "fixed") =>
    setValue("pricing.discountType", value, { shouldDirty: true });

  const setDiscountValue = (value: number) =>
    setValue("pricing.discountValue", value, { shouldDirty: true });

  const profit = useMemo(
    () =>
      calculateProfit(
        sellingPrice,
        costPrice
      ),
    [sellingPrice, costPrice]
  );

  const margin = useMemo(
    () =>
      calculateMargin(
        sellingPrice,
        costPrice
      ),
    [sellingPrice, costPrice]
  );

  const customerSavings = useMemo(
    () =>
      calculateCustomerSavings(
        sellingPrice,
        comparePrice
      ),
    [sellingPrice, comparePrice]
  );

  const breakEvenPrice = useMemo(
    () =>
      calculateBreakEvenPrice(
        costPrice,
        taxRate
      ),
    [costPrice, taxRate]
  );

  return (
    <div className="space-y-8">

      <div className="grid gap-8 xl:grid-cols-3">

        <div className="xl:col-span-2">

          <PricingForm
            sellingPrice={sellingPrice}
            comparePrice={comparePrice}
            costPrice={costPrice}
            taxRate={taxRate}
            discountType={discountType}
            discountValue={discountValue}
            setSellingPrice={setSellingPrice}
            setComparePrice={setComparePrice}
            setCostPrice={setCostPrice}
            setTaxRate={setTaxRate}
            setDiscountType={setDiscountType}
            setDiscountValue={setDiscountValue}
          />

        </div>

        <PricingSummary
  sellingPrice={sellingPrice}
  comparePrice={comparePrice}
  costPrice={costPrice}
  taxRate={taxRate}
  discountType={discountType}
  discountValue={discountValue}
  profit={profit}
  margin={margin}
  customerSavings={customerSavings}
  breakEvenPrice={breakEvenPrice}
/>

                <CustomerPreview
          sellingPrice={sellingPrice}
          comparePrice={comparePrice}
          discountType={discountType}
          discountValue={discountValue}
        />

      </div>

      <PricingWarnings
        sellingPrice={sellingPrice}
        comparePrice={comparePrice}
        costPrice={costPrice}
        margin={margin}
      />

    </div>
  );
}