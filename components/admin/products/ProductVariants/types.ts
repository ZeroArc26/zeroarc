export interface Variant {
  id: string;

  color: string;
  colorHex?: string;

  size: string;

  sku: string;
  barcode: string;

  price: number;
  stock: number;

  image?: string;

  isActive: boolean;
}

export type VariantPreset =
  | "basic"
  | "full"
  | "custom";

export interface VariantGeneratorProps {
  variants: Variant[];
  setVariants: React.Dispatch<React.SetStateAction<Variant[]>>;
}

export interface VariantTableProps {
  variants: Variant[];
  setVariants: React.Dispatch<React.SetStateAction<Variant[]>>;
}

export interface VariantSummaryProps {
  variants: Variant[];
}

export interface VariantAlertsProps {
  variants: Variant[];
}