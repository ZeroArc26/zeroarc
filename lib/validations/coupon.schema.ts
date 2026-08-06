import { z } from "zod";

export const couponSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(3, "Code must be at least 3 characters")
      .max(20, "Code cannot exceed 20 characters")
      .regex(/^[A-Za-z0-9]+$/, "Code can only contain letters and numbers"),

    description: z.string().trim().max(200).optional().default(""),

    discountType: z.enum(["percentage", "fixed"]),

    discountValue: z.number().min(0, "Discount value must be at least 0"),

    minOrderValue: z.number().min(0).default(0),

    maxDiscountAmount: z.number().min(0).optional(),

    usageLimit: z.number().int().min(0).optional(),

    perCustomerLimit: z.number().int().min(0).optional(),

    expiryDate: z.string().optional().nullable(),

    isActive: z.boolean().default(true),
  })
  .refine(
    (data) => data.discountType !== "percentage" || data.discountValue <= 100,
    {
      message: "Percentage discount cannot exceed 100",
      path: ["discountValue"],
    }
  );

export type CouponFormInput = z.input<typeof couponSchema>;
export type CouponFormValues = z.output<typeof couponSchema>;