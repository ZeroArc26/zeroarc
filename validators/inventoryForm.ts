import { z } from "zod";

export const inventoryFormSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),

  variantId: z.string().min(1, "Variant ID is required"),

  warehouse: z.string().min(1, "Warehouse is required"),

  sku: z.string().min(1, "SKU is required"),

  availableStock: z.number().min(0),

  reservedStock: z.number().min(0),

  incomingStock: z.number().min(0),

  lowStockThreshold: z.number().min(0),
});

export type InventoryFormInput = z.infer<typeof inventoryFormSchema>;