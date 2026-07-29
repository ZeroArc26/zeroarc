import { z } from "zod";

/* ----------------------------------------
   Image
----------------------------------------- */

export const categoryImageSchema = z.object({
  url: z.string().default(""),

  alt: z
    .string()
    .trim()
    .default(""),
});

/* ----------------------------------------
   SEO
----------------------------------------- */

export const categorySeoSchema = z.object({
  metaTitle: z
    .string()
    .trim()
    .max(60, "Meta title cannot exceed 60 characters.")
    .default(""),

  metaDescription: z
    .string()
    .trim()
    .max(160, "Meta description cannot exceed 160 characters.")
    .default(""),

  index: z
    .boolean()
    .default(true),
});

/* ----------------------------------------
   Category
----------------------------------------- */

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters.")
    .max(80, "Category name cannot exceed 80 characters."),

  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, "Slug must be at least 2 characters.")
    .max(100, "Slug cannot exceed 100 characters.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers and hyphens."
    ),

  description: z
    .string()
    .trim()
    .max(1000, "Description cannot exceed 1000 characters.")
    .default(""),

  image: categoryImageSchema,

  parentCategory: z
    .string()
    .nullable()
    .optional()
    .default(null),

  featured: z
    .boolean()
    .default(false),

  status: z
    .enum([
      "draft",
      "published",
      "archived",
    ])
    .default("draft"),

  sortOrder: z
    .number()
    .int("Sort order must be a whole number.")
    .min(0, "Sort order cannot be negative.")
    .default(0),

  seo: categorySeoSchema.default({
    metaTitle: "",
    metaDescription: "",
    index: true,
  }),
});

/* ----------------------------------------
   Types
----------------------------------------- */

export type CategoryFormValues = z.infer<
  typeof categorySchema
>;

export type Category = z.output<
  typeof categorySchema
>;