import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import ShippingLabelDocument from "@/lib/pdf/ShippingLabelDocument";

interface RouteParams {
  params: Promise<{ id: string }>;
}

function loadLogoDataUrl() {
  try {
    const logoPath = path.join(
      process.cwd(),
      "public",
      "images",
      "shipping-label",
      "zeroarc-logo.png"
    );
    const buffer = fs.readFileSync(logoPath);
    return `data:image/png;base64,${buffer.toString("base64")}`;
  } catch (err) {
    console.error("Could not load shipping-label logo:", err);
    return "";
  }
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    await connectDB();

    const { id } = await params;

    const order = await Order.findById(id).lean<any>();

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    if (!order.shippingLabel?.awbNumber) {
      return NextResponse.json(
        {
          success: false,
          message: "Shipping label not generated yet for this order.",
        },
        { status: 400 }
      );
    }

    const trackingUrl = `${process.env.NEXT_PUBLIC_APP_URL || ""}/account/orders/${order.orderInfo?.orderNumber}`;

    const qrDataUrl = await QRCode.toDataURL(trackingUrl, {
      margin: 1,
      width: 200,
    });

    const logoDataUrl = loadLogoDataUrl();

    const buffer = await renderToBuffer(
      ShippingLabelDocument({ order, qrDataUrl, logoDataUrl }) as any
    );

    const { searchParams } = new URL(request.url);
    const isDownload = searchParams.get("download") === "1";

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${
          isDownload ? "attachment" : "inline"
        }; filename="shipping-label-${order.shippingLabel?.awbNumber || order._id}.pdf"`,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Failed to generate shipping label." },
      { status: 500 }
    );
  }
}