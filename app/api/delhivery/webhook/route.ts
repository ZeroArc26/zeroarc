import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { syncOrderWithDelhivery } from "@/lib/delhiverySync";

interface WebhookBody {
  AWB?: string;
  waybill?: string;
  Shipment?: { AWB?: string };
}

// Register this URL in Delhivery's panel (webhook / push settings):
//   https://zeroarc.in/api/delhivery/webhook?secret=<DELHIVERY_WEBHOOK_SECRET>
// The payload is only used to find the AWB; the real status is
// re-fetched from Delhivery's tracking API before anything changes.
export async function POST(request: Request) {
  const secret = process.env.DELHIVERY_WEBHOOK_SECRET;
  const given = new URL(request.url).searchParams.get("secret");

  if (!secret || given !== secret) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as WebhookBody;
    const awb = body.Shipment?.AWB || body.AWB || body.waybill;

    if (awb) {
      await connectDB();
      const order = await Order.findOne({ "shippingLabel.awbNumber": awb });
      if (order) await syncOrderWithDelhivery(order);
    }
  } catch (error) {
    console.error("DELHIVERY WEBHOOK ERROR:", error);
  }

  // Always 200 once authenticated so Delhivery doesn't retry forever.
  return NextResponse.json({ success: true });
}
