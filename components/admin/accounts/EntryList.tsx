"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  HandCoins,
  Package,
  Pencil,
  RotateCcw,
  Trash2,
  Undo2,
  type LucideIcon,
} from "lucide-react";

import type { EntryRow } from "./EntryModal";
import { TYPE_META, isUdhaar, istToday, type LedgerType } from "@/lib/ledger/meta";

const money = (n: number) =>
  `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(n)}`;

const ist = (d: string) => new Date(new Date(d).getTime() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);

const ICON: Record<LedgerType, { icon: LucideIcon; cls: string }> = {
  income: { icon: ArrowDownLeft, cls: "bg-emerald-500/15 text-emerald-400" },
  expense: { icon: ArrowUpRight, cls: "bg-rose-500/15 text-rose-400" },
  purchase: { icon: Package, cls: "bg-amber-500/15 text-amber-400" },
  receivable: { icon: HandCoins, cls: "bg-sky-500/15 text-sky-400" },
  payable: { icon: Undo2, cls: "bg-orange-500/15 text-orange-400" },
};

function dayLabel(day: string) {
  const today = istToday();
  const yesterday = new Date(Date.parse(`${today}T00:00:00Z`) - 86400000).toISOString().slice(0, 10);
  if (day === today) return "Aaj";
  if (day === yesterday) return "Kal";
  return new Date(`${day}T12:00:00Z`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function EntryList({
  entries,
  busyId,
  confirmId,
  onEdit,
  onSettle,
  onAskDelete,
  onDelete,
}: {
  entries: EntryRow[];
  busyId: string;
  confirmId: string;
  onEdit: (e: EntryRow) => void;
  onSettle: (e: EntryRow) => void;
  onAskDelete: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const groups: { day: string; items: EntryRow[] }[] = [];
  for (const e of entries) {
    const day = ist(e.date);
    const last = groups[groups.length - 1];
    if (last && last.day === day) last.items.push(e);
    else groups.push({ day, items: [e] });
  }

  return (
    <div className="space-y-5">
      {groups.map((g) => {
        const dayNet = g.items.reduce((s, e) => {
          if (e.type === "income") return s + e.amount;
          if (e.type === "expense" || e.type === "purchase") return s - e.amount;
          return s;
        }, 0);

        return (
          <section key={g.day}>
            <div className="mb-2 flex items-baseline justify-between px-1">
              <h4 className="text-sm font-semibold text-zinc-300">{dayLabel(g.day)}</h4>
              {dayNet !== 0 && (
                <span className={`text-xs tabular-nums ${dayNet > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {dayNet > 0 ? "+" : "−"}
                  {money(Math.abs(dayNet))}
                </span>
              )}
            </div>

            <ul className="divide-y divide-zinc-800/70 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40">
              {g.items.map((e) => {
                const udhaar = isUdhaar(e.type);
                const settled = udhaar && e.status === "settled";
                const plus = e.type === "income";
                const Icon = ICON[e.type].icon;
                const busy = busyId === e._id;

                const primary = e.title || e.category || e.party || TYPE_META[e.type].label;
                const meta = [
                  e.category && e.title ? e.category : "",
                  e.party && e.party !== primary ? e.party : "",
                  e.quantity ? `Qty ${e.quantity}` : "",
                  !udhaar && e.paymentMode ? e.paymentMode.toUpperCase() : "",
                  udhaar && !settled && e.dueDate ? `Wapsi ${dayLabel(ist(e.dueDate))}` : "",
                  e.note,
                ].filter(Boolean);

                return (
                  <li key={e._id} className="flex items-center gap-3 px-3.5 py-3 sm:gap-4 sm:px-4">
                    <button
                      type="button"
                      onClick={() => onEdit(e)}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left sm:gap-4"
                      aria-label={`Edit: ${primary}`}
                    >
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${ICON[e.type].cls}`}>
                        <Icon className="h-[18px] w-[18px]" />
                      </span>

                      <span className="block min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-white">{primary}</span>
                        <span className="block truncate text-xs text-zinc-500">
                          <span className="text-zinc-400">{TYPE_META[e.type].label}</span>
                          {meta.length > 0 && ` · ${meta.join(" · ")}`}
                        </span>
                      </span>
                    </button>

                    <div className="shrink-0 text-right">
                      <p
                        className={`font-[family:var(--font-space)] text-sm font-bold tabular-nums sm:text-base ${
                          udhaar ? "text-zinc-200" : plus ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {udhaar ? "" : plus ? "+" : "−"}
                        {money(e.amount)}
                      </p>
                      {udhaar && (
                        <p className={`text-[11px] font-medium ${settled ? "text-emerald-400" : "text-amber-400"}`}>
                          {settled ? "Settled" : "Baaki"}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 items-center gap-0.5">
                      {udhaar && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => onSettle(e)}
                          className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white disabled:opacity-50"
                          aria-label={settled ? "Wapas baaki karo" : "Settle karo"}
                          title={settled ? "Wapas baaki karo" : "Settle karo"}
                        >
                          {settled ? <RotateCcw className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onEdit(e)}
                        className="hidden rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-white sm:inline-flex"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      {confirmId === e._id ? (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => onDelete(e._id)}
                          className="rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-50"
                        >
                          Delete?
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onAskDelete(e._id)}
                          className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-red-400"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
