// Shared by server and client — keep free of server-only imports.

export const LEDGER_TYPES = ["expense", "income", "purchase", "receivable", "payable"] as const;
export type LedgerType = (typeof LEDGER_TYPES)[number];

export const PAYMENT_MODES = ["cash", "upi", "bank", "card", "other"] as const;
export type PaymentMode = (typeof PAYMENT_MODES)[number];

export const TYPE_META: Record<LedgerType, { label: string; hint: string }> = {
  expense: { label: "Expense", hint: "Ads, packaging, courier, salary, rent…" },
  income: { label: "Income", hint: "Sales outside the website (Flipkart, DMs, offline)" },
  purchase: { label: "Stock purchase", hint: "Goods bought from a supplier" },
  receivable: { label: "To receive", hint: "Money someone owes you (you lent or sold on credit)" },
  payable: { label: "To pay", hint: "Money you owe someone (you borrowed or bought on credit)" },
};

export const CATEGORIES: Record<LedgerType, string[]> = {
  expense: [
    "Ads / Marketing",
    "Packaging",
    "Courier / Shipping",
    "Salary",
    "Rent",
    "Software / Tools",
    "Photoshoot / Content",
    "Return / Refund loss",
    "Other",
  ],
  income: ["Flipkart", "Instagram / WhatsApp", "Offline / Store", "Other"],
  purchase: ["Fabric / Material", "Ready stock", "Printing / Embroidery", "Stitching", "Other"],
  receivable: ["Other"],
  payable: ["Other"],
};

export const isUdhaar = (t: string) => t === "receivable" || t === "payable";

/** Today's date in IST as YYYY-MM-DD. */
export function istToday(now: number = Date.now()) {
  return new Date(now + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/** YYYY-MM-DD → instants in IST. */
export const istStart = (d: string) => new Date(`${d}T00:00:00+05:30`);
export const istEnd = (d: string) => new Date(`${d}T23:59:59.999+05:30`);
export const istNoon = (d: string) => new Date(`${d}T12:00:00+05:30`);

export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
