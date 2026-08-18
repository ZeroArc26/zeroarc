export interface PricingFormProps {
  sellingPrice: number;
  comparePrice: number;
  costPrice: number;
  taxRate: number;
  discountType: "percentage" | "fixed";
  discountValue: number;

  setSellingPrice: (value: number) => void;
  setComparePrice: (value: number) => void;
  setCostPrice: (value: number) => void;
  setTaxRate: (value: number) => void;
  setDiscountType: (value: "percentage" | "fixed") => void;
  setDiscountValue: (value: number) => void;
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