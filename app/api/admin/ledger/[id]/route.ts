import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { requireAdmin } from "@/lib/auth/admin";
import connectDB from "@/lib/mongodb";
import LedgerEntry from "@/models/LedgerEntry";
import { unauthorized } from "@/lib/ledger/http";
import { ledgerEntrySchema } from "@/lib/ledger/schema";
import { isUdhaar, istNoon, istStart } from "@/lib/ledger/meta";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const bad = (message: string, status = 400) =>
  NextResponse.json({ success: false, message }, { status });

// Edit an entry, or settle / re-open an udhaar: { action: "settle" | "reopen" }
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return bad("Invalid id");

    const body = await request.json();
    const entry = await LedgerEntry.findById(id);
    if (!entry) return bad("Entry not found", 404);

    if (body?.action === "settle" || body?.action === "reopen") {
      if (!isUdhaar(entry.type)) return bad("Only udhaar entries can be settled");
      entry.status = body.action === "settle" ? "settled" : "pending";
      entry.settledAt = body.action === "settle" ? new Date() : undefined;
      await entry.save();
      return NextResponse.json({ success: true });
    }

    const parsed = ledgerEntrySchema.safeParse(body);
    if (!parsed.success) return bad(parsed.error.issues[0]?.message || "Invalid entry");
    const v = parsed.data;

    const wasUdhaar = isUdhaar(entry.type);

    entry.type = v.type;
    entry.date = istNoon(v.date);
    entry.amount = v.amount;
    entry.category = v.category;
    entry.title = v.title;
    entry.party = v.party;
    entry.quantity = v.quantity;
    entry.paymentMode = v.paymentMode;
    entry.note = v.note;
    entry.dueDate = isUdhaar(v.type) && v.dueDate ? istStart(v.dueDate) : undefined;
    if (!isUdhaar(v.type)) {
      entry.status = "settled";
      entry.settledAt = undefined;
    } else if (!wasUdhaar) {
      // a normal entry turned into udhaar starts as pending
      entry.status = "pending";
      entry.settledAt = undefined;
    }
    await entry.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    const u = unauthorized(error);
    if (u) return u;
    console.error("LEDGER UPDATE ERROR:", error);
    return bad("Failed to update entry", 500);
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return bad("Invalid id");

    await LedgerEntry.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const u = unauthorized(error);
    if (u) return u;
    console.error("LEDGER DELETE ERROR:", error);
    return bad("Failed to delete entry", 500);
  }
}
