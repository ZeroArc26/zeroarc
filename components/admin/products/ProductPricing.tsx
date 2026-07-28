"use client";

import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";

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
  const [sellingPrice, setSellingPrice] = useState(1299);
  const [comparePrice, setComparePrice] = useState(1999);
  const [costPrice, setCostPrice] = useState(650);
  const [taxRate, setTaxRate] = useState(18);

  const [discountType, setDiscountType] = useState<
    "percentage" | "fixed"
  >("percentage");

  const [discountValue, setDiscountValue] = useState(35);

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