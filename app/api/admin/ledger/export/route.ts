import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/admin";
import connectDB from "@/lib/mongodb";
import LedgerEntry from "@/models/LedgerEntry";
import { unauthorized } from "@/lib/ledger/http";
import { buildEntryFilter } from "@/lib/ledger/query";
import { istToday, TYPE_META, type LedgerType } from "@/lib/ledger/meta";

const csvCell = (v: unknown) => {
  let s = v == null ? "" : String(v);
  // Neutralise spreadsheet formula injection from free-text fields.
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

interface Row {
  type: string;
  date?: Date;
  dueDate?: Date;
  category?: string;
  title?: string;
  party?: string;
  quantity?: number;
  paymentMode?: string;
  amount: number;
  status?: string;
  note?: string;
}

const day = (d?: Date | string | null) =>
  d ? new Date(new Date(d).getTime() + 5.5 * 3600 * 1000).toISOString().slice(0, 10) : "";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    await connectDB();

    const entries = await LedgerEntry.find(buildEntryFilter(new URL(request.url).searchParams))
      .sort({ date: 1, createdAt: 1 })
      .limit(5000)
      .lean<Row[]>();

    const header = [
      "Date",
      "Type",
      "Category",
      "Detail",
      "Party",
      "Quantity",
      "Payment mode",
      "Amount (INR)",
      "Status",
      "Due date",
      "Note",
    ];

    const rows = entries.map((e) => [
      day(e.date),
      TYPE_META[e.type as LedgerType]?.label ?? e.type,
      e.category,
      e.title,
      e.party,
      e.quantity ?? "",
      e.paymentMode,
      e.amount,
      e.type === "receivable" || e.type === "payable" ? e.status : "",
      day(e.dueDate),
      e.note,
    ]);

    // BOM so Excel opens Hindi / Hinglish text correctly.
    const csv = "﻿" + [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="zeroarc-accounts-${istToday()}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const u = unauthorized(error);
    if (u) return u;
    console.error("LEDGER EXPORT ERROR:", error);
    return NextResponse.json({ success: false, message: "Export failed" }, { status: 500 });
  }
}
