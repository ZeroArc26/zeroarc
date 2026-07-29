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

/* -------------------------------- */
/* Shared Setter Type               */
/* -------------------------------- */

export type SetVariants = (
  value: Variant[] | ((prev: Variant[]) => Variant[])
) => void;

/* -------------------------------- */
/* Component Props                  */
/* -------------------------------- */

export interface VariantGeneratorProps {
  variants: Variant[];
  setVariants: SetVariants;
}

export interface VariantTableProps {
  variants: Variant[];
  setVariants: SetVariants;
}

export interface VariantSummaryProps {
  variants: Variant[];
}

export interface VariantAlertsProps {
  variants: Variant[];
}