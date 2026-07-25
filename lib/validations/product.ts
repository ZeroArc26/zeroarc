import { z } from "zod";

export const productSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters."),

  slug: z
    .string()
    .min(3, "Slug is required."),

  description: z
    .string()
    .min(20, "Description is too short."),

  price: z
    .number()
    .min(1, "Price must be greater than 0."),

  comparePrice: z
    .number()
    .min(0)
    .optional(),

  category: z.string().min(1, "Category is required."),

  collectionName: z.string().min(1, "Collection is required."),

  images: z.array(z.string()).default([]),

  sizes: z.array(z.string()).default([]),

  colors: z.array(z.string()).default([]),

  stock: z.number().min(0),

  variants: z
  .array(
    z.object({
      color: z.string().min(1, "Color is required."),
      size: z.string().min(1, "Size is required."),
      stock: z.number().min(0),
    })
  )
  .default([]),

  lowStockLimit: z.number().min(0).default(5),

  featured: z.boolean().default(false),

  bestseller: z.boolean().default(false),

  newArrival: z.boolean().default(false),

  active: z.boolean().default(true),
});

export type ProductInput = z.infer<typeof productSchema>;