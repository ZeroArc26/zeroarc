import { DATE_RE, istEnd, istStart } from "@/lib/ledger/meta";

export function parseRange(params: URLSearchParams) {
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  return {
    from: DATE_RE.test(from) ? istStart(from) : undefined,
    to: DATE_RE.test(to) ? istEnd(to) : undefined,
  };
}

export const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Mongo filter for the entries list / CSV export from URL params. */
export function buildEntryFilter(params: URLSearchParams) {
  const filter: Record<string, unknown> = {};
  const { from, to } = parseRange(params);

  if (from || to) {
    filter.date = { ...(from ? { $gte: from } : {}), ...(to ? { $lte: to } : {}) };
  }

  const type = params.get("type") || "";
  if (type === "udhaar") filter.type = { $in: ["receivable", "payable"] };
  else if (["expense", "income", "purchase", "receivable", "payable"].includes(type)) filter.type = type;

  const status = params.get("status");
  if (status === "pending" || status === "settled") filter.status = status;

  const q = (params.get("q") || "").trim().slice(0, 80);
  if (q) {
    const re = new RegExp(escapeRegex(q), "i");
    filter.$or = [{ title: re }, { party: re }, { category: re }, { note: re }];
  }

  return filter;
}
