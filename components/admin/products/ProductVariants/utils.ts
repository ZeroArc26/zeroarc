import { Variant } from "./types";

/* -------------------------------- */
/* SKU Generator                    */
/* -------------------------------- */

export function generateVariantSKU(
  color: string,
  size: string,
  index: number
) {
  const colorCode = color.substring(0, 3).toUpperCase();
  const sizeCode = size.toUpperCase();

  return `ZA-${colorCode}-${sizeCode}-${String(index + 1).padStart(3, "0")}`;
}

/* -------------------------------- */
/* Barcode Generator                */
/* -------------------------------- */

export function generateVariantBarcode(index: number) {
  return `890${String(index + 1).padStart(9, "0")}`;
}

/* -------------------------------- */
/* Generate Variant Combinations    */
/* -------------------------------- */

export function generateVariants(
  colors: string[],
  sizes: string[],
  price: number,
  stock: number
): Variant[] {
  const variants: Variant[] = [];

  let index = 0;

  colors.forEach((color) => {
    sizes.forEach((size) => {
      variants.push({
        id: crypto.randomUUID(),

        color,
        size,

        colorHex: "",

        sku: generateVariantSKU(color, size, index),
        barcode: generateVariantBarcode(index),

        price,
        stock,

        image: "",

        isActive: true,
      });

      index++;
    });
  });

  return variants;
}

/* -------------------------------- */
/* Duplicate Checker                */
/* -------------------------------- */

export function isDuplicateVariant(
  variants: Variant[],
  color: string,
  size: string
) {
  return variants.some(
    (variant) =>
      variant.color === color &&
      variant.size === size
  );
}

/* -------------------------------- */
/* Summary                          */
/* -------------------------------- */

export function getTotalStock(variants: Variant[]) {
  return variants.reduce(
    (total, variant) => total + variant.stock,
    0
  );
}

export function getActiveVariants(
  variants: Variant[]
) {
  return variants.filter(
    (variant) => variant.isActive
  ).length;
}

export function getLowestStockVariant(
  variants: Variant[]
) {
  if (!variants.length) return null;

  return [...variants].sort(
    (a, b) => a.stock - b.stock
  )[0];
}