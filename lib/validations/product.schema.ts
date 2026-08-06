import { z } from "zod";

/* ----------------------------------------
   Images
----------------------------------------- */

export const imageSchema = z.object({
  url: z.string().url("Invalid image URL"),

  color: z.string().default("Default"),

  alt: z.string().default(""),

  isCover: z.boolean().default(false),

  order: z.number().int().default(0),
});

/* ----------------------------------------
   Variants
----------------------------------------- */

export const variantSchema = z.object({
  id: z.string(),

  color: z.string(),

  colorHex: z.string().optional(),

  size: z.string(),

  sku: z.string(),

  barcode: z.string(),

  price: z.number().min(0),

  stock: z.number().int().min(0),

  image: z.string().optional(),

  isActive: z.boolean().default(true),
});

/* ----------------------------------------
   Basic Info
----------------------------------------- */

export const basicInfoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(120),

  slug: z
    .string()
    .trim()
    .min(3)
    .max(150)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers and hyphens"
    ),

  description: z
    .string()
    .trim()
    .min(10, "Description is too short")
    .max(5000),

  brand: z
    .string()
    .trim()
    .min(2)
    .max(60),

  category: z
    .string()
    .trim()
    .min(2)
    .max(60),

  audience: z.enum(["men", "women", "unisex"]),

  tags: z
    .array(z.string().trim())
    .default([]),
});

/* ----------------------------------------
   Pricing
----------------------------------------- */

export const pricingSchema = z.object({
  sellingPrice: z
  .number()
  .min(0, "Selling price must be at least 0"),

  comparePrice: z
    .number()
    .min(0)
    .optional(),

  costPrice: z
  .number()
  .min(0, "Cost price must be at least 0"),

  taxClass: z
    .string()
    .default("GST 18%"),

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

/* ----------------------------------------
   Inventory
----------------------------------------- */

export const inventorySchema = z.object({
  sku: z
    .string()
    .trim()
    .min(2, "SKU must be at least 2 characters"),

  barcode: z
    .string()
    .trim()
    .default(""),

  quantity: z
    .number()
    .int()
    .min(0, "Quantity cannot be negative"),

  lowStockThreshold: z
    .number()
    .int()
    .min(0)
    .default(5),

  reorderLevel: z
    .number()
    .int()
    .min(0)
    .default(10),

  trackInventory: z
    .boolean()
    .default(true),

  allowBackorders: z
    .boolean()
    .default(false),
});

/* ----------------------------------------
   SEO
----------------------------------------- */

export const seoSchema = z.object({
  metaTitle: z
    .string()
    .max(60)
    .optional(),

  metaDescription: z
    .string()
    .max(160)
    .optional(),

  index: z
    .boolean()
    .default(true),
});

/* ----------------------------------------
   Publish
----------------------------------------- */

export const publishSchema = z.object({
  status: z.enum([
    "draft",
    "active",
    "archived",
  ]),

  featured: z
    .boolean()
    .default(false),

  publishedAt: z
    .date()
    .nullable()
    .default(null),
});

/* ----------------------------------------
   Product Schema
----------------------------------------- */

export const productSchema = z.object({
  basicInfo: basicInfoSchema,

  pricing: pricingSchema,

  inventory: inventorySchema,

  images: z.array(imageSchema).default([]),

  variants: z.array(variantSchema).default([]),

  seo: seoSchema,

  publish: publishSchema,
});

/* ----------------------------------------
   Types
----------------------------------------- */

export type ProductFormInput = z.input<typeof productSchema>;
export type ProductFormValues = z.output<typeof productSchema>;
export type Product = z.output<typeof productSchema>;