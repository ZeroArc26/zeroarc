import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import LedgerEntry from "@/models/LedgerEntry";

export interface LedgerSummary {
  website: { sales: number; orders: number; refunds: number };
  manual: { income: number; expense: number; purchase: number };
  net: number;
  pending: { receivable: number; payable: number };
  categories: { name: string; amount: number; kind: "expense" | "purchase" }[];
  months: { month: string; income: number; outgo: number }[];
}

interface Range {
  from?: Date;
  to?: Date;
}

const rangeMatch = (field: string, r: Range) => {
  const m: Record<string, Date> = {};
  if (r.from) m.$gte = r.from;
  if (r.to) m.$lte = r.to;
  return Object.keys(m).length ? { [field]: m } : {};
};

const monthOf = (field: string) => ({
  $dateToString: { format: "%Y-%m", date: field, timezone: "Asia/Kolkata" },
});

/**
 * Cash-basis summary. "Website sales" = orders that are paid or delivered
 * and not cancelled; refunds are the refunded returns. Udhaar (receivable /
 * payable) is shown separately and is never part of net profit.
 */
export async function getLedgerSummary(range: Range): Promise<LedgerSummary> {
  await connectDB();

  const salesMatch = {
    ...rangeMatch("createdAt", range),
    "orderInfo.status": { $ne: "cancelled" },
    $or: [{ "payment.status": "paid" }, { "orderInfo.status": "delivered" }],
  };
  const refundMatch = {
    "returnInfo.status": "refunded",
    ...rangeMatch("returnInfo.refundedAt", range),
  };
  const ledgerMatch = {
    type: { $in: ["income", "expense", "purchase"] },
    ...rangeMatch("date", range),
  };

  const [salesByMonth, refundsByMonth, ledgerByTypeMonth, ledgerByCategory, pending] =
    await Promise.all([
      Order.aggregate([
        { $match: salesMatch },
        {
          $group: {
            _id: monthOf("$createdAt"),
            total: { $sum: "$pricing.grandTotal" },
            count: { $sum: 1 },
          },
        },
      ]),
      Order.aggregate([
        { $match: refundMatch },
        { $group: { _id: monthOf("$returnInfo.refundedAt"), total: { $sum: "$returnInfo.refundAmount" } } },
      ]),
      LedgerEntry.aggregate([
        { $match: ledgerMatch },
        { $group: { _id: { type: "$type", month: monthOf("$date") }, total: { $sum: "$amount" } } },
      ]),
      LedgerEntry.aggregate([
        { $match: { ...ledgerMatch, type: { $in: ["expense", "purchase"] } } },
        {
          $group: {
            _id: { type: "$type", category: { $ifNull: ["$category", ""] } },
            total: { $sum: "$amount" },
          },
        },
      ]),
      LedgerEntry.aggregate([
        { $match: { type: { $in: ["receivable", "payable"] }, status: "pending" } },
        { $group: { _id: "$type", total: { $sum: "$amount" } } },
      ]),
    ]);

  const monthMap = new Map<string, { income: number; outgo: number }>();
  const bump = (month: string, key: "income" | "outgo", v: number) => {
    if (!month) return;
    const cur = monthMap.get(month) ?? { income: 0, outgo: 0 };
    cur[key] += v;
    monthMap.set(month, cur);
  };

  let sales = 0;
  let orders = 0;
  let refunds = 0;
  for (const r of salesByMonth) {
    sales += r.total || 0;
    orders += r.count || 0;
    bump(r._id, "income", r.total || 0);
  }
  for (const r of refundsByMonth) {
    refunds += r.total || 0;
    bump(r._id, "outgo", r.total || 0);
  }

  const manual = { income: 0, expense: 0, purchase: 0 };
  for (const r of ledgerByTypeMonth) {
    const t = r._id.type as "income" | "expense" | "purchase";
    manual[t] += r.total || 0;
    bump(r._id.month, t === "income" ? "income" : "outgo", r.total || 0);
  }

  const categories = ledgerByCategory
    .map((r) => ({
      name: (r._id.category as string) || "Uncategorised",
      amount: r.total as number,
      kind: r._id.type as "expense" | "purchase",
    }))
    .sort((a, b) => b.amount - a.amount);

  const months = [...monthMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([month, v]) => ({ month, ...v }));

  const pend = { receivable: 0, payable: 0 };
  for (const r of pending) pend[r._id as "receivable" | "payable"] = r.total || 0;

  return {
    website: { sales, orders, refunds },
    manual,
    net: sales + manual.income - refunds - manual.expense - manual.purchase,
    pending: pend,
    categories,
    months,
  };
}
