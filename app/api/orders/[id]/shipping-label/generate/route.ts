import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { getStoreSettings } from "@/lib/settings";
import { createDelhiveryShipment } from "@/lib/delhivery";

interface RouteParams {
  params: Promise<{ id: string }>;
}

function generateTrackingId() {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `ZA-TRK-${random}`;
}

function generateShippingId() {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `SHIP${timestamp}${random}`;
}

function generateProvisionalAwb() {
  const timestamp = Date.now().toString().slice(-9);
  const random = Math.floor(100 + Math.random() * 900);
  return `${timestamp}${random}`;
}

function estimatePackage(itemCount: number) {
  if (itemCount <= 2) {
    return {
      packageType: "Poly Mailer",
      weight: Math.round((0.1 + itemCount * 0.3) * 100) / 100,
      dimensions: { length: 30, width: 22, height: 5 },
    };
  }
  if (itemCount <= 5) {
    return {
      packageType: "Poly Mailer",
      weight: Math.round((0.15 + itemCount * 0.3) * 100) / 100,
      dimensions: { length: 35, width: 28, height: 10 },
    };
  }
  return {
    packageType: "Box",
    weight: Math.round((0.3 + itemCount * 0.3) * 100) / 100,
    dimensions: { length: 40, width: 30, height: 15 },
  };
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    await connectDB();

    const { id } = await params;

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    const settings = await getStoreSettings();

    const itemCount = (order.items || []).reduce(
      (sum: number, item: any) => sum + (item.quantity || 1),
      0
    );

    const estimate = estimatePackage(itemCount || 1);
    const address = order.customer?.shippingAddress || {};

    const sellerAddressLine = [
      settings.address?.line1,
      settings.address?.line2,
      settings.address?.city,
      settings.address?.state,
      settings.address?.pincode,
    ]
      .filter(Boolean)
      .join(", ");

    // Try real Delhivery first. If their API is unavailable (their
    // account setup is currently blocked as of this note), fall back
    // to a provisional AWB so the admin workflow isn't blocked — this
    // will start returning real waybills automatically the moment
    // Delhivery's side is fixed, with no code change needed.
    const delhiveryResult = await createDelhiveryShipment({
      orderNumber: order.orderInfo?.orderNumber,
      customerName: order.customer?.name,
      customerPhone: order.customer?.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      paymentMode: order.payment?.method === "cod" ? "cod" : "prepaid",
      codAmount: order.payment?.method === "cod" ? order.pricing?.grandTotal || 0 : 0,
      totalAmount: order.pricing?.grandTotal || 0,
      weightGrams: Math.round(estimate.weight * 1000),
      dimensions: estimate.dimensions,
      productsDesc: (order.items || []).map((i: any) => i.name).join(", "),
      quantity: itemCount,
      sellerName: settings.store?.name || "ZEROARC CO.",
      sellerAddress: sellerAddressLine,
    });

    let awbNumber: string;
    let isProvisional = false;

    if (delhiveryResult.success && delhiveryResult.waybill) {
      awbNumber = delhiveryResult.waybill;
    } else {
      console.error(
        "Delhivery shipment failed, falling back to provisional AWB:",
        delhiveryResult.message
      );
      awbNumber = generateProvisionalAwb();
      isProvisional = true;
    }

    const existing: any = order.shippingLabel || {};

    order.shippingLabel = {
      shippingId: existing.shippingId || generateShippingId(),
      trackingId: existing.trackingId || generateTrackingId(),
      courierPartner: "Delhivery",
      awbNumber,
      isProvisionalAwb: isProvisional,
      weight: estimate.weight,
      dimensions: estimate.dimensions,
      packageType: estimate.packageType,
      receiver: {
        name: order.customer?.name,
        phone: order.customer?.phone,
        address: address.address,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
      },
      warehouse: {
        name: settings.store?.name || "ZEROARC CO.",
        address: sellerAddressLine,
        phone: settings.store?.phone || "",
      },
      qrCode: existing.qrCode || "",
    };

    await order.save();

    return NextResponse.json({
      success: true,
      order,
      warning: isProvisional
        ? `Delhivery API unavailable (${delhiveryResult.message}). Used a provisional AWB — this is NOT trackable with Delhivery yet.`
        : undefined,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Failed to generate shipping label." },
      { status: 500 }
    );
  }
}