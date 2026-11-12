import { z } from "zod";

import { DATE_RE, LEDGER_TYPES, PAYMENT_MODES, isUdhaar } from "@/lib/ledger/meta";

const dateStr = z.string().regex(DATE_RE, "Invalid date");

export const ledgerEntrySchema = z
  .object({
    type: z.enum(LEDGER_TYPES),
    date: dateStr,
    amount: z.coerce.number().positive("Amount must be greater than 0").max(100000000),
    category: z.string().trim().max(60).optional().default(""),
    title: z.string().trim().max(120).optional().default(""),
    party: z.string().trim().max(80).optional().default(""),
    quantity: z.coerce.number().positive().max(10000000).optional(),
    paymentMode: z.enum(PAYMENT_MODES).optional().default("upi"),
    note: z.string().trim().max(500).optional().default(""),
    dueDate: dateStr.optional().or(z.literal("")),
  })
  .superRefine((v, ctx) => {
    if (isUdhaar(v.type) && !v.party) {
      ctx.addIssue({ code: "custom", path: ["party"], message: "Enter a name" });
    }
    if (!isUdhaar(v.type) && !v.title && !v.category) {
      ctx.addIssue({ code: "custom", path: ["title"], message: "Enter a category or a detail" });
    }
  });

export type LedgerEntryInput = z.infer<typeof ledgerEntrySchema>;
