/**
 * ZeroArc Inventory Utilities
 */

/**
 * Converts product title into SKU-friendly text
 *
 * Naruto Oversized Tee
 * =>
 * NARUTO-OVERSIZED-TEE
 */
export function slugToSKU(title: string) {
  return title
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Generates master SKU
 *
 * ZA-NARUTO-OVERSIZED-TEE
 */
export function generateSKU(title: string) {
  const base = slugToSKU(title);

  if (!base) {
    return "ZA-" + crypto.randomUUID().slice(0, 6).toUpperCase();
  }

  return `ZA-${base}`;
}

/**
 * Generates Variant SKU
 *
 * ZA-NARUTO-BLK-M
 */
export function generateVariantSKU(
  masterSKU: string,
  color: string,
  size: string
) {
  const colorCode = color
    .trim()
    .slice(0, 3)
    .toUpperCase();

  const sizeCode = size
    .trim()
    .toUpperCase();

  return `${masterSKU}-${colorCode}-${sizeCode}`;
}

/**
 * Generates 13 digit barcode
 */
export function generateBarcode() {
  let barcode = "";

  for (let i = 0; i < 13; i++) {
    barcode += Math.floor(Math.random() * 10);
  }

  return barcode;
}