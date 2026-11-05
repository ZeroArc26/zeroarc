import { NextResponse } from "next/server";

import { getCurrentAdmin, requireAdmin } from "@/lib/auth/admin";
import connectDB from "@/lib/mongodb";
import LedgerEntry from "@/models/LedgerEntry";
import { unauthorized } from "@/lib/ledger/http";
import { buildEntryFilter } from "@/lib/ledger/query";
import { ledgerEntrySchema } from "@/lib/ledger/schema";
import { isUdhaar, istNoon, istStart } from "@/lib/ledger/meta";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    await connectDB();

    const params = new URL(request.url).searchParams;

    const entries = await LedgerEntry.find(buildEntryFilter(params))
      .sort({ date: -1, createdAt: -1 })
      .limit(500)
      .lean<Record<string, unknown>[]>();

    return NextResponse.json({
      success: true,
      entries: entries.map((e) => ({ ...e, _id: String(e._id) })),
    });
  } catch (error) {
    const u = unauthorized(error);
    if (u) return u;
    console.error("LEDGER LIST ERROR:", error);
    return NextResponse.json({ success: false, message: "Failed to load entries" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    await connectDB();

    const parsed = ledgerEntrySchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || "Invalid entry" },
        { status: 400 }
      );
    }
    const v = parsed.data;
    const admin = await getCurrentAdmin();

    const entry = await LedgerEntry.create({
      type: v.type,
      date: istNoon(v.date),
      amount: v.amount,
      category: v.category,
      title: v.title,
      party: v.party,
      quantity: v.quantity,
      paymentMode: v.paymentMode,
      note: v.note,
      status: isUdhaar(v.type) ? "pending" : "settled",
      dueDate: isUdhaar(v.type) && v.dueDate ? istStart(v.dueDate) : undefined,
      createdBy: admin?.email,
    });

    return NextResponse.json({ success: true, id: String(entry._id) }, { status: 201 });
  } catch (error) {
    const u = unauthorized(error);
    if (u) return u;
    console.error("LEDGER CREATE ERROR:", error);
    return NextResponse.json({ success: false, message: "Failed to save entry" }, { status: 500 });
  }
}
