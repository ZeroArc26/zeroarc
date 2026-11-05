"use client";

import { useState } from "react";
import { X } from "lucide-react";

import {
  CATEGORIES,
  LEDGER_TYPES,
  PAYMENT_MODES,
  TYPE_META,
  isUdhaar,
  istToday,
  type LedgerType,
} from "@/lib/ledger/meta";

export interface EntryRow {
  _id: string;
  type: LedgerType;
  date: string;
  amount: number;
  category?: string;
  title?: string;
  party?: string;
  quantity?: number;
  paymentMode?: string;
  note?: string;
  status?: "pending" | "settled";
  dueDate?: string;
}

const ymd = (d?: string) =>
  d ? new Date(new Date(d).getTime() + 5.5 * 3600 * 1000).toISOString().slice(0, 10) : "";

const field =
  "w-full rounded-xl border border-zinc-700 bg-zinc-950/60 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500";
const label = "mb-1.5 block text-xs font-medium text-zinc-400";

export default function EntryModal({
  entry,
  defaultType,
  onClose,
  onSaved,
}: {
  entry: EntryRow | null;
  defaultType: LedgerType;
  onClose: () => void;
  onSaved: () => void;
}) {
  const editing = !!entry;
  const [type, setType] = useState<LedgerType>(entry?.type ?? defaultType);
  const [date, setDate] = useState(entry ? ymd(entry.date) : istToday());
  const [amount, setAmount] = useState(entry ? String(entry.amount) : "");
  const [category, setCategory] = useState(entry?.category ?? "");
  const [title, setTitle] = useState(entry?.title ?? "");
  const [party, setParty] = useState(entry?.party ?? "");
  const [quantity, setQuantity] = useState(entry?.quantity ? String(entry.quantity) : "");
  const [paymentMode, setPaymentMode] = useState(entry?.paymentMode ?? "upi");
  const [dueDate, setDueDate] = useState(ymd(entry?.dueDate));
  const [note, setNote] = useState(entry?.note ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const udhaar = isUdhaar(type);
  const partyLabel =
    type === "purchase" ? "Supplier" : type === "receivable" ? "Kisse milna hai" : type === "payable" ? "Kisko dena hai" : "Party (optional)";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(editing ? `/api/admin/ledger/${entry!._id}` : "/api/admin/ledger", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          date,
          amount,
          category,
          title,
          party,
          quantity: type === "purchase" && quantity ? quantity : undefined,
          paymentMode,
          dueDate: udhaar ? dueDate : "",
          note,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Save nahi hua.");
        return;
      }
      onSaved();
    } catch {
      setError("Network error. Dobara try karo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4" onMouseDown={onClose}>
      <form
        onSubmit={submit}
        onMouseDown={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-2xl sm:rounded-3xl sm:p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">{editing ? "Entry edit karo" : "Nayi entry"}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-1 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {LEDGER_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setType(t);
                setCategory("");
              }}
              className={`rounded-xl border px-2 py-2 text-xs font-semibold transition ${
                type === t
                  ? "border-violet-500 bg-violet-600 text-white"
                  : "border-zinc-700 bg-zinc-950/40 text-zinc-300 hover:border-zinc-500"
              }`}
            >
              {TYPE_META[t].label}
            </button>
          ))}
        </div>
        <p className="mb-4 text-xs text-zinc-500">{TYPE_META[type].hint}</p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Amount (₹)</label>
            <input className={field} inputMode="decimal" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} required autoFocus />
          </div>
          <div>
            <label className={label}>Date</label>
            <input className={field} type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          {!udhaar && (
            <div>
              <label className={label}>Category</label>
              <select className={field} value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select…</option>
                {CATEGORIES[type].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className={label}>{partyLabel}</label>
            <input className={field} value={party} onChange={(e) => setParty(e.target.value)} placeholder={udhaar ? "Naam" : "—"} required={udhaar} />
          </div>

          <div className="sm:col-span-2">
            <label className={label}>Detail</label>
            <input className={field} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Jaise: Instagram ads, 50 tees, courier bill…" />
          </div>

          {type === "purchase" && (
            <div>
              <label className={label}>Quantity (optional)</label>
              <input className={field} inputMode="decimal" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Pieces / meters" />
            </div>
          )}

          {!udhaar && (
            <div>
              <label className={label}>Payment mode</label>
              <select className={field} value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
                {PAYMENT_MODES.map((m) => (
                  <option key={m} value={m}>
                    {m.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          )}

          {udhaar && (
            <div>
              <label className={label}>Wapsi ki date (optional)</label>
              <input className={field} type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          )}

          <div className="sm:col-span-2">
            <label className={label}>Note (optional)</label>
            <textarea className={`${field} min-h-[64px] resize-y`} value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </div>

        {udhaar && (
          <p className="mt-3 rounded-xl bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
            Udhaar profit/loss me nahi judta. Jab paisa mil jaaye ya de do, tab entry ko &quot;Settle&quot; kar dena.
          </p>
        )}

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-xl border border-zinc-700 px-4 py-2.5 text-sm text-zinc-300 hover:border-zinc-500">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60">
            {saving ? "Saving…" : editing ? "Update" : "Save entry"}
          </button>
        </div>
      </form>
    </div>
  );
}
