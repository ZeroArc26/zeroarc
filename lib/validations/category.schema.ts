import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name is required")
    .max(100),

  slug: z
    .string()
    .trim()
    .min(2)
    .max(120),

  description: z
    .string()
    .max(1000)
    .optional()
    .or(z.literal("")),

  image: z
    .string()
    .optional()
    .or(z.literal("")),

  parentCategory: z
    .string()
    .optional()
    .or(z.literal("")),

  featured: z
    .boolean()
    .default(false),

  status: z.enum([
    "active",
    "inactive",
  ]),

  sortOrder: z
    .number()
    .min(0)
    .default(0),

  seo: z.object({
    metaTitle: z
      .string()
      .max(60)
      .optional()
      .or(z.literal("")),

    metaDescription: z
      .string()
      .max(160)
      .optional()
      .or(z.literal("")),

    metaKeywords: z
      .array(z.string())
      .default([]),
  }),
});

export type CategoryFormValues =
  z.infer<typeof categorySchema>;