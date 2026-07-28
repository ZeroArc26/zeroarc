"use client";

import { useFormContext } from "react-hook-form";
import type { ProductFormValues } from "@/lib/validations/product.schema";

import VariantGenerator from "./ProductVariants/VariantGenerator";
import VariantSummary from "./ProductVariants/VariantSummary";
import VariantAlerts from "./ProductVariants/VariantAlerts";
import VariantTable from "./ProductVariants/VariantTable";

import { Variant } from "./ProductVariants/types";

export default function ProductVariants() {
  const { watch, setValue } =
  useFormContext<ProductFormValues>();

const variants =
  watch("variants") ?? [];

const setVariants = (
  value:
    | Variant[]
    | ((prev: Variant[]) => Variant[])
) => {
  const updated =
    typeof value === "function"
      ? value(variants)
      : value;

  setValue("variants", updated, {
    shouldDirty: true,
    shouldTouch: true,
    shouldValidate: true,
  });
};

  return (
    <div className="space-y-6">

      {/* Top Section */}

      <div className="grid gap-6 xl:grid-cols-3">

        {/* Generator */}

        <div className="xl:col-span-2">

          <VariantGenerator
            variants={variants}
            setVariants={setVariants}
          />

        </div>

        {/* Right Sidebar */}

        <div className="space-y-6">

          <VariantSummary
            variants={variants}
          />

          <VariantAlerts
            variants={variants}
          />

        </div>

      </div>

      {/* Table */}

      <VariantTable
        variants={variants}
        setVariants={setVariants}
      />

    </div>
  );
}