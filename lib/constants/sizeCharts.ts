export interface SizeRow {
  size: string;
  chest: number;
  length: number;
  shoulder: number;
}

export const SIZE_CHARTS: Record<"regular" | "oversized", SizeRow[]> = {
  regular: [
    { size: "S", chest: 38, length: 26, shoulder: 17 },
    { size: "M", chest: 40, length: 27, shoulder: 18 },
    { size: "L", chest: 42, length: 28, shoulder: 19 },
    { size: "XL", chest: 44, length: 29, shoulder: 20 },
    { size: "XXL", chest: 46, length: 30, shoulder: 21 },
  ],
  oversized: [
    { size: "S", chest: 42, length: 27, shoulder: 20 },
    { size: "M", chest: 44, length: 28, shoulder: 21 },
    { size: "L", chest: 46, length: 29, shoulder: 22 },
    { size: "XL", chest: 48, length: 30, shoulder: 23 },
    { size: "XXL", chest: 50, length: 31, shoulder: 24 },
  ],
};

/**
 * Products can have fitType "slim" | "regular" | "oversized" (or none).
 * We don't have separate slim-fit measurements yet, so slim/missing
 * fall back to the regular chart until real slim-fit numbers are given.
 */
export function getSizeChart(fitType?: string): SizeRow[] {
  if (fitType === "oversized") return SIZE_CHARTS.oversized;
  return SIZE_CHARTS.regular;
}

export function getChestForSize(size: string, fitType?: string): number | undefined {
  return getSizeChart(fitType).find((row) => row.size === size)?.chest;
}
