import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { syncOrderWithDelhivery } from "@/lib/delhiverySync";

// Vercel Cron calls this with "Authorization: Bearer <CRON_SECRET>".
// Safety net in case a webhook is missed.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  await connectDB();

  const orders = await Order.find({
    "orderInfo.status": { $in: ["confirmed", "processing", "shipped"] },
    "shippingLabel.courierPartner": "Delhivery",
    "shippingLabel.awbNumber": { $exists: true, $ne: "" },
    "shippingLabel.isProvisionalAwb": { $ne: true },
  })
    .sort({ updatedAt: 1 })
    .limit(50);

  let updated = 0;
  for (const order of orders) {
    try {
      if (await syncOrderWithDelhivery(order)) updated++;
    } catch (error) {
      console.error("DELHIVERY CRON ITEM ERROR:", error);
    }
  }

  return NextResponse.json({ success: true, checked: orders.length, updated });
}
