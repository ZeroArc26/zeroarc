import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/auth";
import { getAdminCookie } from "@/lib/auth/cookies";
import { verifyAdminToken } from "@/lib/auth/jwt";
import { createDelhiveryReversePickup } from "@/lib/delhivery";
import { getStoreSettings } from "@/lib/settings";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const RETURN_WINDOW_DAYS = 7;

function estimatePackage(itemCount: number) {
  if (itemCount <= 2) {
    return {
      weight: Math.round((0.1 + itemCount * 0.3) * 100) / 100,
      dimensions: { length: 30, width: 22, height: 5 },
    };
  }
  if (itemCount <= 5) {
    return {
      weight: Math.round((0.15 + itemCount * 0.3) * 100) / 100,
      dimensions: { length: 35, width: 28, height: 10 },
    };
  }
  return {
    weight: Math.round((0.3 + itemCount * 0.3) * 100) / 100,
    dimensions: { length: 40, width: 30, height: 15 },
  };
}

// ---------------- Customer: request a return ----------------
export async function POST(request: Request, { params }: RouteParams) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    const user = await getCurrentUser();
    const isOwner =
      user?.email?.toLowerCase() === order.customer?.email?.toLowerCase();

    if (!isOwner) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 403 }
      );
    }

    if (order.orderInfo?.status !== "delivered") {
      return NextResponse.json(
        { success: false, message: "Only delivered orders can be returned." },
        { status: 400 }
      );
    }

    if (order.returnInfo?.status && order.returnInfo.status !== "none") {
      return NextResponse.json(
        { success: false, message: "A return request already exists for this order." },
        { status: 400 }
      );
    }

    const deliveredEvent = (order.timeline || []).find(
      (t: any) => t.event?.toLowerCase() === "delivered"
    );
    if (deliveredEvent?.date) {
      const daysSinceDelivery =
        (Date.now() - new Date(deliveredEvent.date).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceDelivery > RETURN_WINDOW_DAYS) {
        return NextResponse.json(
          {
            success: false,
            message: `Return window of ${RETURN_WINDOW_DAYS} days has passed.`,
          },
          { status: 400 }
        );
      }
    }

    if (!body.reason) {
      return NextResponse.json(
        { success: false, message: "Please select a reason for the return." },
        { status: 400 }
      );
    }

    order.returnInfo = {
      status: "requested",
      reason: body.reason,
      comments: body.comments || "",
      images: Array.isArray(body.images) ? body.images.slice(0, 5) : [],
      requestedAt: new Date(),
    };

    await order.save();

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to submit return request." },
      { status: 500 }
    );
  }
}

// ---------------- Admin: manage the return ----------------
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

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

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 403 }
      );
    }

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    if (!order.returnInfo || order.returnInfo.status === "none") {
      return NextResponse.json(
        { success: false, message: "No return request exists for this order." },
        { status: 400 }
      );
    }

    // If the admin is scheduling pickup and we haven't already booked
    // one, create a real Delhivery reverse-pickup shipment.
    if (
      body.status === "pickup_scheduled" &&
      !order.returnInfo.pickupAwb
    ) {
      const settings = await getStoreSettings();

      const itemCount = (order.items || []).reduce(
        (sum: number, item: any) => sum + (item.quantity || 1),
        0
      );
      const estimate = estimatePackage(itemCount || 1);
      const address = order.customer?.shippingAddress || {};

      const warehouseAddressLine = [
        settings.address?.line1,
        settings.address?.line2,
        settings.address?.city,
      ]
        .filter(Boolean)
        .join(", ");

      const pickupResult = await createDelhiveryReversePickup({
        returnRefNumber: `RET-${order.orderInfo?.orderNumber}`,
        customerName: order.customer?.name,
        customerPhone: order.customer?.phone,
        customerAddress: address.address,
        customerCity: address.city,
        customerState: address.state,
        customerPincode: address.pincode,
        returnToName: settings.store?.name || "ZEROARC CO.",
        returnToAddress: warehouseAddressLine,
        returnToCity: settings.address?.city || "",
        returnToState: settings.address?.state || "",
        returnToPincode: settings.address?.pincode || "",
        weightGrams: Math.round(estimate.weight * 1000),
        dimensions: estimate.dimensions,
        productsDesc: (order.items || []).map((i: any) => i.name).join(", "),
        quantity: itemCount,
      });

      if (pickupResult.success && pickupResult.waybill) {
        order.returnInfo.pickupAwb = pickupResult.waybill;
        order.returnInfo.pickupCourier = "Delhivery";
      } else {
        console.error(
          "Delhivery reverse pickup failed, continuing without real AWB:",
          pickupResult.message
        );
      }
    }

    if (body.status) {
      order.returnInfo.status = body.status;
    }
    if (body.pickupDate) {
      order.returnInfo.pickupDate = new Date(body.pickupDate);
    }
    if (body.refundAmount !== undefined) {
      order.returnInfo.refundAmount = body.refundAmount;
    }
    if (body.status === "refunded") {
      order.returnInfo.refundedAt = new Date();
    }
    if (body.adminNotes !== undefined) {
      order.returnInfo.adminNotes = body.adminNotes;
    }

    await order.save();

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to update return request." },
      { status: 500 }
    );
  }
}