"use client";

import { MotionConfig, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import type { LedgerSummary } from "@/lib/ledger/summary";

const money = (n: number) =>
  `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(n))}`;

interface Seg {
  label: string;
  value: number;
  color: string;
  note?: string;
}

/** One horizontal bar made of segments; `scale` keeps both bars comparable. */
function FlowBar({ title, total, segs, scale }: { title: string; total: number; segs: Seg[]; scale: number }) {
  const live = segs.filter((s) => s.value > 0);

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <p className="text-sm font-medium text-zinc-300">{title}</p>
        <p className="font-[family:var(--font-space)] text-lg font-bold tabular-nums text-white">{money(total)}</p>
      </div>

      <div className="flex h-9 w-full overflow-hidden rounded-xl bg-zinc-800/60">
        {live.map((s) => (
          <motion.div
            key={s.label}
            title={`${s.label}: ${money(s.value)}`}
            className="h-full border-r border-zinc-950/40 last:border-r-0"
            style={{ background: s.color }}
            initial={{ width: 0 }}
            animate={{ width: `${scale > 0 ? (s.value / scale) * 100 : 0}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </div>

      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
        {segs.map((s) => (
          <span key={s.label} className={`inline-flex items-center gap-1.5 text-xs ${s.value > 0 ? "text-zinc-300" : "text-zinc-600"}`}>
            <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
            {s.label}
            <span className="tabular-nums text-zinc-500">{money(s.value)}</span>
            {s.note && <span className="text-zinc-600">· {s.note}</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function AccountsHero({
  summary,
  onOpenUdhaar,
}: {
  summary: LedgerSummary;
  onOpenUdhaar: () => void;
}) {
  const income = summary.website.sales + summary.manual.income;
  const outgo = summary.manual.expense + summary.manual.purchase + summary.website.refunds;
  const scale = Math.max(income, outgo);
  const loss = summary.net < 0;
  const margin = income > 0 ? Math.round((summary.net / income) * 100) : null;

  return (
    <MotionConfig reducedMotion="user">
      <section className="grid overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/40 lg:grid-cols-[1fr_300px]">
        <div className="p-5 sm:p-7">
          <p className="text-sm text-zinc-400">{loss ? "Is period me ghata" : "Is period me bacha"}</p>
          <p
            className={`mt-1 font-[family:var(--font-space)] text-5xl font-black tabular-nums tracking-tight sm:text-6xl ${
              loss ? "text-rose-400" : "text-white"
            }`}
          >
            {loss ? "−" : ""}
            {money(Math.abs(summary.net))}
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            {margin !== null ? `Aamdani ka ${margin}% ${loss ? "minus me" : "bacha"} · ` : ""}
            {summary.website.orders} website orders
          </p>

          {scale > 0 ? (
            <div className="mt-7 space-y-6">
              <FlowBar
                title="Aaya"
                total={income}
                scale={scale}
                segs={[
                  { label: "Website", value: summary.website.sales, color: "#10b981" },
                  { label: "Manual", value: summary.manual.income, color: "#6ee7b7" },
                ]}
              />
              <FlowBar
                title="Gaya"
                total={outgo}
                scale={scale}
                segs={[
                  { label: "Kharcha", value: summary.manual.expense, color: "#f43f5e" },
                  { label: "Stock kharidi", value: summary.manual.purchase, color: "#f59e0b" },
                  { label: "Refund", value: summary.website.refunds, color: "#a1a1aa" },
                ]}
              />
            </div>
          ) : (
            <p className="mt-7 rounded-2xl border border-dashed border-zinc-700 px-4 py-6 text-sm text-zinc-500">
              Is period me abhi koi aamdani ya kharcha nahi. Pehli entry chadhao ya range badlo.
            </p>
          )}

          <p className="mt-6 text-[11px] text-zinc-600">
            Paisa jis din aaya/gaya usi din ginta hai. Website me sirf paid ya delivered orders judte hain.
          </p>
        </div>

        <div className="flex flex-col border-t border-zinc-800 lg:border-l lg:border-t-0">
          <button
            type="button"
            onClick={onOpenUdhaar}
            className="group flex flex-1 flex-col justify-between gap-6 p-5 text-left transition hover:bg-zinc-800/30 sm:p-7"
          >
            <div>
              <p className="text-sm font-medium text-zinc-300">Udhaar baaki</p>
              <p className="mt-0.5 text-xs text-zinc-500">Profit me nahi judta</p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-zinc-500">Mujhe milna hai</p>
                <p className="font-[family:var(--font-space)] text-2xl font-bold tabular-nums text-emerald-400">
                  {money(summary.pending.receivable)}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Mujhe dena hai</p>
                <p className="font-[family:var(--font-space)] text-2xl font-bold tabular-nums text-amber-400">
                  {money(summary.pending.payable)}
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-400">
              Udhaar entries dekho
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </button>
        </div>
      </section>
    </MotionConfig>
  );
}
