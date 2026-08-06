import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),

  slug: z.string().min(1, "Slug is required"),

  description: z.string().max(1000).optional().default(""),

  image: z.object({
    url: z.string().optional().default(""),
    alt: z.string().optional().default(""),
  }),

  parentCategory: z.string().nullable().optional(),

  featured: z.boolean().default(false),

  status: z.enum(["draft", "published", "archived"]).default("draft"),

  sortOrder: z.number().min(0).default(0),

  seo: z.object({
    metaTitle: z.string().optional().default(""),
    metaDescription: z.string().optional().default(""),
    index: z.boolean().default(true),
  }),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;