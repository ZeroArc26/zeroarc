import { z } from "zod";

export const updateAdminProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name cannot exceed 50 characters."),

  avatar: z.string().optional(),
});

export type UpdateAdminProfileInput = z.infer<typeof updateAdminProfileSchema>;