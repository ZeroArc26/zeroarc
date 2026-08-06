import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

interface RouteParams {
  params: Promise<{ id: string }>;
}

function generateAwbNumber() {
  const timestamp = Date.now().toString().slice(-9);
  const random = Math.floor(100 + Math.random() * 900);
  return `${timestamp}${random}`;
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

// Sensible auto-estimate until real courier API gives real weight/dims.
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

    const itemCount = (order.items || []).reduce(
      (sum: number, item: any) => sum + (item.quantity || 1),
      0
    );

    const estimate = estimatePackage(itemCount || 1);
    const address = order.customer?.shippingAddress || {};
    const existing: any = order.shippingLabel || {};

    order.shippingLabel = {
      shippingId: existing.shippingId || generateShippingId(),
      trackingId: existing.trackingId || generateTrackingId(),
      courierPartner: "Delhivery", // provisional until real API is connected
      awbNumber: generateAwbNumber(),
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
        name: "ZEROARC CO.",
        address: "", // TBD once Settings model exists
        phone: "",
      },
      qrCode: existing.qrCode || "",
    };

    await order.save();

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Failed to generate shipping label." },
      { status: 500 }
    );
  }
}