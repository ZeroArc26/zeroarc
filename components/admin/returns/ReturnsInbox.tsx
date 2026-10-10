"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2, RotateCcw, Search, ExternalLink } from "lucide-react";

interface ReturnRow {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  grandTotal: number;
  itemCount: number;
  status: string;
  reason: string;
  comments: string;
  requestedAt: string | null;
  pickupDate: string | null;
  pickupAwb: string;
  refundAmount: number | null;
  refundedAt: string | null;
}

const STATUS_META: Record<string, { label: string; cls: string }> = {
  requested: { label: "Requested", cls: "border-amber-700 bg-amber-950/40 text-amber-300" },
  approved: { label: "Approved", cls: "border-sky-700 bg-sky-950/40 text-sky-300" },
  rejected: { label: "Rejected", cls: "border-red-700 bg-red-950/40 text-red-300" },
  pickup_scheduled: { label: "Pickup Scheduled", cls: "border-violet-700 bg-violet-950/40 text-violet-300" },
  picked_up: { label: "Picked Up", cls: "border-indigo-700 bg-indigo-950/40 text-indigo-300" },
  refunded: { label: "Refunded", cls: "border-emerald-700 bg-emerald-950/40 text-emerald-300" },
};

const FILTERS = [
  { value: "all", label: "All" },
  { value: "requested", label: "Requested" },
  { value: "approved", label: "Approved" },
  { value: "pickup_scheduled", label: "Pickup" },
  { value: "picked_up", label: "Picked Up" },
  { value: "refunded", label: "Refunded" },
  { value: "rejected", label: "Rejected" },
];

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export default function ReturnsInbox() {
  const [rows, setRows] = useState<ReturnRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/returns", { cache: "no-store" });
        const data = await res.json();
        if (cancelled) return;
        if (data.success) setRows(data.returns);
        else setError(data.message || "Failed to load returns.");
      } catch {
        if (!cancelled) setError("Failed to load returns.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    rows.forEach((r) => {
      c[r.status] = (c[r.status] || 0) + 1;
    });
    return c;
  }, [rows]);

  const pendingRefund = useMemo(
    () =>
      rows
        .filter((r) => ["approved", "pickup_scheduled", "picked_up"].includes(r.status))
        .reduce((s, r) => s + r.grandTotal, 0),
    [rows]
  );
  const totalRefunded = useMemo(
    () =>
      rows
        .filter((r) => r.status === "refunded")
        .reduce((s, r) => s + (r.refundAmount ?? r.grandTotal), 0),
    [rows]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (!q) return true;
      return (
        r.orderNumber.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        r.customerEmail.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q)
      );
    });
  }, [rows, filter, query]);

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-zinc-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <p className="py-10 text-center text-red-400">{error}</p>;
  }

  const stats = [
    { label: "Needs Action", value: String(counts.requested || 0), cls: "text-amber-300" },
    {
      label: "In Progress",
      value: String((counts.approved || 0) + (counts.pickup_scheduled || 0) + (counts.picked_up || 0)),
      cls: "text-violet-300",
    },
    { label: "Refund Pending", value: inr(pendingRefund), cls: "text-sky-300" },
    { label: "Total Refunded", value: inr(totalRefunded), cls: "text-emerald-300" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
            <p className="text-xs font-medium text-zinc-500">{s.label}</p>
            <p className={`mt-2 text-2xl font-bold ${s.cls}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
                filter === f.value
                  ? "border-violet-500 bg-violet-600 text-white"
                  : "border-zinc-700 bg-zinc-900/40 text-zinc-300 hover:border-zinc-500"
              }`}
            >
              {f.label}
              {f.value !== "all" && counts[f.value] ? ` (${counts[f.value]})` : ""}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order, customer, reason..."
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-2.5 pl-9 pr-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-500"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-zinc-800 bg-zinc-900/40 py-16 text-zinc-500">
          <RotateCcw className="h-8 w-8" />
          <p className="mt-3 text-sm">No return requests found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-900/40">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-xs text-zinc-500">
                <th className="px-5 py-4 font-medium">Order</th>
                <th className="px-5 py-4 font-medium">Customer</th>
                <th className="px-5 py-4 font-medium">Reason</th>
                <th className="px-5 py-4 font-medium">Requested</th>
                <th className="px-5 py-4 font-medium">Amount</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4" />
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => {
                const meta = STATUS_META[r.status] ?? STATUS_META.requested;
                return (
                  <tr key={r._id} className="border-b border-zinc-800/60 last:border-0 hover:bg-zinc-900/60">
                    <td className="px-5 py-4 font-mono text-white">#{r.orderNumber}</td>
                    <td className="px-5 py-4">
                      <p className="text-white">{r.customerName}</p>
                      <p className="text-xs text-zinc-500">{r.customerEmail}</p>
                    </td>
                    <td className="max-w-[220px] px-5 py-4">
                      <p className="truncate text-zinc-200">{r.reason || "—"}</p>
                      {r.pickupAwb && (
                        <p className="mt-0.5 font-mono text-xs text-emerald-400">AWB {r.pickupAwb}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-zinc-300">{fmtDate(r.requestedAt)}</td>
                    <td className="px-5 py-4 text-white">
                      {inr(r.status === "refunded" ? r.refundAmount ?? r.grandTotal : r.grandTotal)}
                      <p className="text-xs text-zinc-500">{r.itemCount} item(s)</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full border px-3 py-1 text-xs font-medium ${meta.cls}`}>
                        {meta.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/dashboard/orders/${r._id}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-500"
                      >
                        Manage <ExternalLink className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
