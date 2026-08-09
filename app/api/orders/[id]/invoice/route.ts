import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import InvoiceDocument from "@/lib/pdf/InvoiceDocument";
import { getStoreSettings } from "@/lib/settings";
import { getCurrentUser } from "@/lib/auth";
import { getAdminCookie } from "@/lib/auth/cookies";
import { verifyAdminToken } from "@/lib/auth/jwt";

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

function loadDelhiveryLogoDataUrl() {
  try {
    const logoPath = path.join(
      process.cwd(),
      "public",
      "images",
      "shipping-label",
      "delhivery-logo.png"
    );
    const buffer = fs.readFileSync(logoPath);
    return `data:image/png;base64,${buffer.toString("base64")}`;
  } catch (err) {
    console.error("Could not load Delhivery logo:", err);
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

    // ---- Ownership check: only the order's own customer, or an admin, can access this invoice ----
    const currentUser = await getCurrentUser();
    const isOwner =
      currentUser?.email?.toLowerCase() === order.customer?.email?.toLowerCase();

    let isAdmin = false;
    try {
      const adminToken = await getAdminCookie();
      if (adminToken) {
        verifyAdminToken(adminToken);
        isAdmin = true;
      }
    } catch {
      isAdmin = false;
    }

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 403 }
      );
    }

    const settings = await getStoreSettings();

    const company = {
      name: settings.store?.name || "ZEROARC CO.",
      tagline: settings.store?.tagline || "WEAR YOUR NEXT ARC",
      website: settings.store?.website || "",
      phone: settings.store?.phone || "",
      email: settings.store?.email || "",
      gstin: settings.tax?.gstin || "",
      state: settings.tax?.companyState || "West Bengal",
    };

    // ------------------------------------------------------------
    // If this order has a REAL Delhivery AWB (not a provisional
    // fallback), the invoice's QR code points straight to
    // Delhivery's own public tracking page for that AWB. Otherwise
    // it falls back to ZeroArc's own order-tracking page — so the
    // QR always works, never a dead/broken link.
    // ------------------------------------------------------------
    const isRealDelhiveryAwb =
      order.shippingLabel?.courierPartner === "Delhivery" &&
      order.shippingLabel?.awbNumber &&
      !order.shippingLabel?.isProvisionalAwb;

    const trackingUrl = isRealDelhiveryAwb
      ? `https://www.delhivery.com/track/package/${order.shippingLabel.awbNumber}`
      : `${process.env.NEXT_PUBLIC_APP_URL || ""}/account/orders/${order.orderInfo?.orderNumber}`;

    const qrDataUrl = await QRCode.toDataURL(trackingUrl, {
      margin: 1,
      width: 200,
    });

    const logoDataUrl = loadLogoDataUrl();
    const delhiveryLogoDataUrl = loadDelhiveryLogoDataUrl();

    const buffer = await renderToBuffer(
      InvoiceDocument({
        order,
        qrDataUrl,
        logoDataUrl,
        delhiveryLogoDataUrl,
        company,
      }) as any
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