export enum InventoryStatus {
  IN_STOCK = "IN_STOCK",
  LOW_STOCK = "LOW_STOCK",
  OUT_OF_STOCK = "OUT_OF_STOCK",
  PRE_ORDER = "PRE_ORDER",
}

export interface InventoryVariant {
  variantId: string;
  sku: string;

  availableStock: number;
  reservedStock: number;
  incomingStock: number;

  lowStockThreshold: number;

  status: InventoryStatus;
}

export interface InventoryDocument {
  _id: string;

  productId: string;

  variants: InventoryVariant[];

  warehouse?: string;

  createdAt: Date;
  updatedAt: Date;
}