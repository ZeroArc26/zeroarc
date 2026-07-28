import { Dispatch, SetStateAction } from "react";

export interface PricingFormProps {
  sellingPrice: number;
  comparePrice: number;
  costPrice: number;
  taxRate: number;
  discountType: "percentage" | "fixed";
  discountValue: number;

  setSellingPrice: Dispatch<SetStateAction<number>>;
  setComparePrice: Dispatch<SetStateAction<number>>;
  setCostPrice: Dispatch<SetStateAction<number>>;
  setTaxRate: Dispatch<SetStateAction<number>>;
  setDiscountType: Dispatch<
    SetStateAction<"percentage" | "fixed">
  >;
  setDiscountValue: Dispatch<SetStateAction<number>>;
}

export interface PricingSummaryProps {
  sellingPrice: number;
  comparePrice: number;
  costPrice: number;
  taxRate: number;
  discountType: "percentage" | "fixed";
  discountValue: number;

  profit: number;
  margin: number;
  customerSavings: number;
  breakEvenPrice: number;
}

export interface CustomerPreviewProps {
  sellingPrice: number;
  comparePrice: number;
  discountType: "percentage" | "fixed";
  discountValue: number;
}

export interface PricingWarningsProps {
  sellingPrice: number;
  comparePrice: number;
  costPrice: number;
  margin: number;
}