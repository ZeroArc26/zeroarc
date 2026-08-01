import { z } from "zod";

// =========================
// ADDRESS SCHEMA
// =========================

const addressSchema = z.object({
  address: z.string().default(""),
  city: z.string().default(""),
  state: z.string().default(""),
  pincode: z.string().default(""),
  country: z.string().default("India"),
});

// =========================
// CUSTOMER SCHEMA
// =========================

export const customerSchema = z.object({
  userId: z.string().optional(),

  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100),

  email: z
    .string()
    .trim()
    .email("Invalid email address."),

  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits.")
    .max(15),

  avatar: z
    .string()
    .optional()
    .default(""),

  address: addressSchema.default({
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  }),

  status: z.enum([
    "active",
    "blocked",
  ]).default("active"),

  totalOrders: z
    .number()
    .min(0)
    .default(0),

  totalSpent: z
    .number()
    .min(0)
    .default(0),

  lastOrderAt: z
    .coerce
    .date()
    .optional(),
});

// =========================
// TYPES
// =========================

export type CustomerFormInput =
  z.input<typeof customerSchema>;

export type CustomerFormValues =
  z.output<typeof customerSchema>;