"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Plus, Search } from "lucide-react";

import AccountsHero from "./AccountsHero";
import AccountsInsights from "./AccountsCharts";
import EntryList from "./EntryList";
import EntryModal, { type EntryRow } from "./EntryModal";
import { istToday, type LedgerType } from "@/lib/ledger/meta";
import type { LedgerSummary } from "@/lib/ledger/summary";

type Preset = "this_month" | "last_month" | "last_30" | "this_fy" | "this_year" | "all" | "custom";
type Tab = "all" | "expense" | "income" | "purchase" | "udhaar";

const PRESETS: { value: Preset; label: string }[] = [
  { value: "this_month", label: "This month" },
  { value: "last_month", label: "Last month" },
  { value: "last_30", label: "Last 30 days" },
  { value: "this_fy", label: "This financial year" },
  { value: "this_year", label: "This year" },
  { value: "all", label: "All" },
  { value: "custom", label: "Custom" },
];

const TABS: { value: Tab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "expense", label: "Expenses" },
  { value: "income", label: "Income" },
  { value: "purchase", label: "Stock purchases" },
  { value: "udhaar", label: "Dues" },
];

function rangeFor(p: Preset): { from: string; to: string } {
  const today = istToday();
  const [y, m] = [Number(today.slice(0, 4)), Number(today.slice(5, 7))];
  const pad = (n: number) => String(n).padStart(2, "0");
  const lastDay = (yy: number, mm: number) => new Date(Date.UTC(yy, mm, 0)).getUTCDate();

  switch (p) {
    case "this_month":
      return { from: `${y}-${pad(m)}-01`, to: `${y}-${pad(m)}-${lastDay(y, m)}` };
    case "last_month": {
      const py = m === 1 ? y - 1 : y;
      const pm = m === 1 ? 12 : m - 1;
      return { from: `${py}-${pad(pm)}-01`, to: `${py}-${pad(pm)}-${lastDay(py, pm)}` };
    }
    case "last_30": {
      const start = new Date(Date.parse(`${today}T00:00:00Z`) - 29 * 86400000).toISOString().slice(0, 10);
      return { from: start, to: today };
    }
    case "this_fy": {
      const fy = m >= 4 ? y : y - 1;
      return { from: `${fy}-04-01`, to: `${fy + 1}-03-31` };
    }
    case "this_year":
      return { from: `${y}-01-01`, to: `${y}-12-31` };
    default:
      return { from: "", to: "" };
  }
}

interface Loaded {
  key: string;
  entries: EntryRow[];
  summary: LedgerSummary | null;
  error: string;
}

export default function AccountsClient() {
  const [preset, setPreset] = useState<Preset>("this_month");
  const [custom, setCustom] = useState({ from: "", to: "" });
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [version, setVersion] = useState(0);
  const [data, setData] = useState<Loaded | null>(null);
  const [modal, setModal] = useState<{ entry: EntryRow | null; type: LedgerType } | null>(null);
  const [confirmId, setConfirmId] = useState("");
  const [busyId, setBusyId] = useState("");

  const range = useMemo(() => (preset === "custom" ? custom : rangeFor(preset)), [preset, custom]);

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (range.from) p.set("from", range.from);
    if (range.to) p.set("to", range.to);
    return p;
  }, [range]);

  const listQs = useMemo(() => {
    const p = new URLSearchParams(qs);
    if (tab !== "all") p.set("type", tab);
    if (query) p.set("q", query);
    return p.toString();
  }, [qs, tab, query]);

  const key = `${listQs}|${version}`;

  // Debounce the search box.
  useEffect(() => {
    const id = setTimeout(() => setQuery(search.trim()), 350);
    return () => clearTimeout(id);
  }, [search]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [listRes, sumRes] = await Promise.all([
          fetch(`/api/admin/ledger?${listQs}`, { cache: "no-store" }),
          fetch(`/api/admin/ledger/summary?${qs.toString()}`, { cache: "no-store" }),
        ]);
        const list = await listRes.json();
        const sum = await sumRes.json();
        if (cancelled) return;
        setData({
          key,
          entries: list.success ? list.entries : [],
          summary: sum.success ? sum.summary : null,
          error: list.success && sum.success ? "" : list.message || sum.message || "Could not load accounts.",
        });
      } catch {
        if (!cancelled) setData({ key, entries: [], summary: null, error: "Network error." });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [key, listQs, qs]);

  const loading = !data || data.key !== key;
  const summary = data?.summary ?? null;
  const entries = data?.entries ?? [];

  const refresh = () => setVersion((v) => v + 1);

  async function act(id: string, init: RequestInit) {
    setBusyId(id);
    try {
      await fetch(`/api/admin/ledger/${id}`, init);
    } finally {
      setBusyId("");
      setConfirmId("");
      refresh();
    }
  }

  const exportHref = `/api/admin/ledger/export?${listQs}`;

  const openNew = () =>
    setModal({ entry: null, type: tab === "all" || tab === "udhaar" ? "expense" : (tab as LedgerType) });

  const chip = (active: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
      active
        ? "border-violet-500 bg-violet-600 text-white"
        : "border-zinc-700 bg-zinc-900/40 text-zinc-300 hover:border-zinc-500"
    }`;

  return (
    <div className="space-y-6 pb-20 sm:pb-0">
      {/* range + actions */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:flex-wrap lg:overflow-visible lg:pb-0">
          {PRESETS.map((p) => (
            <button key={p.value} type="button" onClick={() => setPreset(p.value)} className={`${chip(preset === p.value)} shrink-0`}>
              {p.label}
            </button>
          ))}
        </div>

        <div className="hidden gap-2 sm:flex">
          <a href={exportHref} className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-3.5 py-2.5 text-sm text-zinc-200 hover:border-zinc-500">
            <Download className="h-4 w-4" /> CSV
          </a>
          <button type="button" onClick={openNew} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-500">
            <Plus className="h-4 w-4" /> Nayi entry
          </button>
        </div>
      </div>

      {preset === "custom" && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-400">
          <input type="date" value={custom.from} onChange={(e) => setCustom((c) => ({ ...c, from: e.target.value }))} className="rounded-xl border border-zinc-700 bg-zinc-950/60 px-3 py-2 text-white" />
          <span>to</span>
          <input type="date" value={custom.to} onChange={(e) => setCustom((c) => ({ ...c, to: e.target.value }))} className="rounded-xl border border-zinc-700 bg-zinc-950/60 px-3 py-2 text-white" />
        </div>
      )}

      {data?.error && <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">{data.error}</p>}

      {/* hero + insights */}
      {summary ? (
        <>
          <AccountsHero summary={summary} onOpenUdhaar={() => setTab("udhaar")} />
          <AccountsInsights summary={summary} />
        </>
      ) : (
        <div className="space-y-4" aria-hidden>
          <div className="h-72 animate-pulse rounded-3xl border border-zinc-800 bg-zinc-900/40" />
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="h-72 animate-pulse rounded-3xl border border-zinc-800 bg-zinc-900/40" />
            <div className="h-72 animate-pulse rounded-3xl border border-zinc-800 bg-zinc-900/40" />
          </div>
        </div>
      )}

      {/* entries */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
            {TABS.map((t) => (
              <button key={t.value} type="button" onClick={() => setTab(t.value)} className={`${chip(tab === t.value)} shrink-0`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search entries"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950/60 py-2.5 pl-9 pr-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-2" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-[66px] animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/40" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-zinc-700 px-6 py-14 text-center">
            <p className="text-sm text-zinc-400">
              {query || tab !== "all" ? "No entries match this filter." : "No entries in this period yet."}
            </p>
            <button type="button" onClick={openNew} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-500">
              <Plus className="h-4 w-4" /> Add your first entry
            </button>
          </div>
        ) : (
          <EntryList
            entries={entries}
            busyId={busyId}
            confirmId={confirmId}
            onEdit={(e) => setModal({ entry: e, type: e.type })}
            onSettle={(e) =>
              act(e._id, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: e.status === "settled" ? "reopen" : "settle" }),
              })
            }
            onAskDelete={setConfirmId}
            onDelete={(id) => act(id, { method: "DELETE" })}
          />
        )}

        {entries.length >= 500 && (
          <p className="text-xs text-zinc-500">Showing the first 500 entries. Narrow the date range or export a CSV.</p>
        )}
      </div>

      {/* mobile quick-add */}
      <div className="fixed bottom-5 right-4 z-30 flex flex-col items-end gap-2 sm:hidden">
        <a href={exportHref} className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-200 shadow-lg" aria-label="CSV download">
          <Download className="h-4 w-4" />
        </a>
        <button type="button" onClick={openNew} className="flex h-14 items-center gap-2 rounded-full bg-violet-600 px-5 text-sm font-semibold text-white shadow-xl shadow-violet-900/40">
          <Plus className="h-5 w-5" /> Nayi entry
        </button>
      </div>

      {modal && (
        <EntryModal
          entry={modal.entry}
          defaultType={modal.type}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}
