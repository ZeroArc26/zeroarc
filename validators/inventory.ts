import { z } from "zod";

export const inventoryVariantSchema = z.object({
  variantId: z.string().min(1),

  sku: z.string().min(1),

  availableStock: z.number().min(0),

  reservedStock: z.number().min(0),

  incomingStock: z.number().min(0),

  lowStockThreshold: z.number().min(0),
});

export const inventorySchema = z.object({
  productId: z.string().min(1),

  warehouse: z.string().optional(),

  variants: z.array(inventoryVariantSchema),
});

export type InventoryInput = z.infer<typeof inventorySchema>;