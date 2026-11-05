import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/admin";
import { unauthorized } from "@/lib/ledger/http";
import { parseRange } from "@/lib/ledger/query";
import { getLedgerSummary } from "@/lib/ledger/summary";

export async function GET(request: Request) {
  try {
    await requireAdmin();

    const summary = await getLedgerSummary(parseRange(new URL(request.url).searchParams));
    return NextResponse.json({ success: true, summary });
  } catch (error) {
    const u = unauthorized(error);
    if (u) return u;
    console.error("LEDGER SUMMARY ERROR:", error);
    return NextResponse.json({ success: false, message: "Failed to load summary" }, { status: 500 });
  }
}
