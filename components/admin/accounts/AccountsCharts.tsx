"use client";

import { MotionConfig, motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { LedgerSummary } from "@/lib/ledger/summary";

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const compact = (n: number) =>
  n >= 100000 ? `${(n / 100000).toFixed(1)}L` : n >= 1000 ? `${(n / 1000).toFixed(0)}k` : String(n);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthLabel = (m: string) => `${MONTHS[Number(m.slice(5, 7)) - 1]} ${m.slice(2, 4)}`;

function Panel({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6">
      <h3 className="text-base font-bold text-white">{title}</h3>
      <p className="mb-5 mt-0.5 text-xs text-zinc-500">{sub}</p>
      {children}
    </div>
  );
}

export default function AccountsInsights({ summary }: { summary: LedgerSummary }) {
  const cats = summary.categories.slice(0, 7);
  const catTotal = summary.categories.reduce((s, c) => s + c.amount, 0);
  const top = cats[0]?.amount || 1;
  const months = summary.months.map((m) => ({ ...m, label: monthLabel(m.month) }));

  return (
    <MotionConfig reducedMotion="user">
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Where the money goes" sub="Expenses and stock purchases, largest first">
          {cats.length === 0 ? (
            <p className="py-12 text-center text-sm text-zinc-500">No expenses in this period.</p>
          ) : (
            <ul className="space-y-4">
              {cats.map((c) => (
                <li key={`${c.kind}-${c.name}`}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                    <span className="truncate text-zinc-200">
                      {c.name}
                      {c.kind === "purchase" && <span className="ml-2 text-xs text-amber-400">purchase</span>}
                    </span>
                    <span className="shrink-0 tabular-nums text-zinc-400">
                      <span className="font-semibold text-white">{inr(c.amount)}</span>
                      <span className="ml-2 text-xs text-zinc-500">{Math.round((c.amount / catTotal) * 100)}%</span>
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-800/70">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: c.kind === "purchase" ? "#f59e0b" : "#8b5cf6" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(c.amount / top) * 100}%` }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Monthly cash flow" sub="Money in (website + manual income) vs money out (expenses + purchases + refunds)">
          {months.length === 0 ? (
            <p className="py-12 text-center text-sm text-zinc-500">No data in this period.</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={months} margin={{ left: 0, right: 8 }} barGap={4}>
                  <CartesianGrid vertical={false} stroke="#3f3f46" strokeOpacity={0.35} />
                  <XAxis dataKey="label" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={compact} stroke="#71717a" fontSize={11} width={40} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(v) => inr(Number(v))} cursor={{ fill: "rgba(139,92,246,0.08)" }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
                  <Bar dataKey="income" name="Money in" fill="#10b981" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="outgo" name="Money out" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Panel>
      </div>
    </MotionConfig>
  );
}
