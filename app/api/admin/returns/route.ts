import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/auth/admin";

interface ReturnOrderLean {
  _id: { toString(): string };
  orderInfo?: { orderNumber?: string };
  customer?: { name?: string; email?: string; phone?: string };
  pricing?: { grandTotal?: number };
  items?: { name?: string; quantity?: number }[];
  returnInfo?: {
    status?: string;
    reason?: string;
    comments?: string;
    requestedAt?: Date;
    pickupDate?: Date;
    pickupAwb?: string;
    refundAmount?: number;
    refundedAt?: Date;
  };
}

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();

    const orders = await Order.find({
      "returnInfo.status": { $exists: true, $ne: "none" },
    })
      .sort({ "returnInfo.requestedAt": -1 })
      .select("orderInfo.orderNumber customer pricing.grandTotal items returnInfo")
      .lean<ReturnOrderLean[]>();

    return NextResponse.json({
      success: true,
      returns: orders.map((o) => ({
        _id: o._id.toString(),
        orderNumber: o.orderInfo?.orderNumber ?? "",
        customerName: o.customer?.name ?? "",
        customerEmail: o.customer?.email ?? "",
        customerPhone: o.customer?.phone ?? "",
        grandTotal: o.pricing?.grandTotal ?? 0,
        itemCount: (o.items ?? []).reduce((s, i) => s + (i.quantity || 1), 0),
        status: o.returnInfo?.status ?? "requested",
        reason: o.returnInfo?.reason ?? "",
        comments: o.returnInfo?.comments ?? "",
        requestedAt: o.returnInfo?.requestedAt ?? null,
        pickupDate: o.returnInfo?.pickupDate ?? null,
        pickupAwb: o.returnInfo?.pickupAwb ?? "",
        refundAmount: o.returnInfo?.refundAmount ?? null,
        refundedAt: o.returnInfo?.refundedAt ?? null,
      })),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : undefined;
    if (message === "Unauthorized") {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }
    console.error("ADMIN RETURNS LIST ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load returns." },
      { status: 500 }
    );
  }
}
