import { Dispatch, SetStateAction } from "react";

export interface InventoryFormProps {
  sku: string;
  barcode: string;

  stockQuantity: number;
  lowStockAlert: number;
  reorderLevel: number;

  trackInventory: boolean;
  continueSelling: boolean;

  setSku: Dispatch<SetStateAction<string>>;
  setBarcode: Dispatch<SetStateAction<string>>;

  setStockQuantity: Dispatch<SetStateAction<number>>;
  setLowStockAlert: Dispatch<SetStateAction<number>>;
  setReorderLevel: Dispatch<SetStateAction<number>>;

  setTrackInventory: Dispatch<SetStateAction<boolean>>;
  setContinueSelling: Dispatch<SetStateAction<boolean>>;
}

export interface InventorySummaryProps {
  stockQuantity: number;
  reservedStock: number;

  availableStock: number;

  lowStockAlert: number;
  reorderLevel: number;
}

export interface InventoryPreviewProps {
  stockQuantity: number;
  reservedStock: number;
}

export interface InventoryAlertsProps {
  sku: string;
  barcode: string;

  stockQuantity: number;

  lowStockAlert: number;
  reorderLevel: number;

  trackInventory: boolean;
}