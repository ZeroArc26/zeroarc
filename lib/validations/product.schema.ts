import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                                   Basic                                    */
/* -------------------------------------------------------------------------- */

export const basicInfoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Product title must be at least 3 characters.")
    .max(120, "Product title cannot exceed 120 characters."),

  slug: z
    .string()
    .trim()
    .min(3, "Slug must be at least 3 characters.")
    .max(150)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers and hyphens."
    ),

  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters.")
    .max(5000),

  brand: z
    .string()
    .trim()
    .min(2)
    .max(60),

  category: z
    .string()
    .trim()
    .min(1, "Category is required."),

  tags: z.array(z.string()).default([]),
});

/* -------------------------------------------------------------------------- */
/*                                  Pricing                                   */
/* -------------------------------------------------------------------------- */

export const pricingSchema = z.object({
  sellingPrice: z.number().min(
  0,
  "Selling price must be greater than or equal to 0."
),

  comparePrice: z
    .number()
    .min(0)
    .optional(),

  costPrice: z.number().min(
  0,
  "Cost price must be greater than or equal to 0."
),

  taxClass: z.enum([
    "0",
    "5",
    "12",
    "18",
    "28",
  ]),

  discountType: z.enum([
    "none",
    "percentage",
    "fixed",
  ]),

  discountValue: z
    .number()
    .min(0)
    .default(0),
});

/* -------------------------------------------------------------------------- */
/*                                 Inventory                                  */
/* -------------------------------------------------------------------------- */

export const inventorySchema = z.object({
  sku: z
    .string()
    .trim()
    .min(3)
    .max(60),

  barcode: z
    .string()
    .trim()
    .optional(),

  quantity: z
    .number()
    .int()
    .min(0),

  lowStockThreshold: z
    .number()
    .int()
    .min(0)
    .default(5),

  trackInventory: z.boolean().default(true),

  allowBackorders: z.boolean().default(false),
});

/* -------------------------------------------------------------------------- */
/*                                   Images                                   */
/* -------------------------------------------------------------------------- */

export const imageSchema = z.object({
  url: z.string().url(),

  alt: z.string().default(""),

  isCover: z.boolean().default(false),

  order: z.number().int(),
});

/* -------------------------------------------------------------------------- */
/*                                     SEO                                    */
/* -------------------------------------------------------------------------- */

export const seoSchema = z.object({
  metaTitle: z
    .string()
    .trim()
    .max(60)
    .optional(),

  metaDescription: z
    .string()
    .trim()
    .max(160)
    .optional(),

  index: z
    .boolean()
    .default(true),
});

/* -------------------------------------------------------------------------- */
/*                                  Publish                                   */
/* -------------------------------------------------------------------------- */

export const publishSchema = z.object({
  status: z.enum([
    "draft",
    "active",
    "archived",
  ]),

  featured: z.boolean().default(false),

  publishedAt: z
    .date()
    .optional(),
});

/* -------------------------------------------------------------------------- */
/*                                  Product                                   */
/* -------------------------------------------------------------------------- */

export const productSchema = z.object({
  basicInfo: basicInfoSchema,

  pricing: pricingSchema,

  inventory: inventorySchema,

  images: z.array(imageSchema).default([]),

  variants: z.array(z.any()).default([]),

  seo: seoSchema,

  publish: publishSchema,
});

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export type ProductFormValues = z.input<typeof productSchema>;
export type Product = z.output<typeof productSchema>;