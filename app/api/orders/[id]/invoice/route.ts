import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import InvoiceDocument from "@/lib/pdf/InvoiceDocument";

interface RouteParams {
  params: Promise<{ id: string }>;
}

function loadLogoDataUrl() {
  try {
    const logoPath = path.join(
      process.cwd(),
      "public",
      "images",
      "customer",
      "zeroarc-logo.png"
    );
    const buffer = fs.readFileSync(logoPath);
    return `data:image/png;base64,${buffer.toString("base64")}`;
  } catch (err) {
    console.error("Could not load ZeroArc logo for invoice:", err);
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

    const trackingUrl = `${process.env.NEXT_PUBLIC_APP_URL || ""}/account/orders/${order.orderInfo?.orderNumber}`;

    const qrDataUrl = await QRCode.toDataURL(trackingUrl, {
      margin: 1,
      width: 200,
    });

    const logoDataUrl = loadLogoDataUrl();

    const buffer = await renderToBuffer(
      InvoiceDocument({ order, qrDataUrl, logoDataUrl }) as any
    );

    const { searchParams } = new URL(request.url);
    const isDownload = searchParams.get("download") === "1";

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${
          isDownload ? "attachment" : "inline"
        }; filename="invoice-${order.invoiceInfo?.invoiceNumber || order._id}.pdf"`,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Failed to generate invoice." },
      { status: 500 }
    );
  }
}