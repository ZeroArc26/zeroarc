import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { trackDelhiveryShipment } from "@/lib/delhivery";
import { getCurrentUser } from "@/lib/auth";
import { getAdminCookie } from "@/lib/auth/cookies";
import { verifyAdminToken } from "@/lib/auth/jwt";

interface RouteParams {
  params: Promise<{ id: string }>;
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

    // Same ownership check as invoice route
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

    const isRealDelhiveryAwb =
      order.shippingLabel?.courierPartner === "Delhivery" &&
      order.shippingLabel?.awbNumber &&
      !order.shippingLabel?.isProvisionalAwb;

    if (!isRealDelhiveryAwb) {
      return NextResponse.json({
        success: false,
        message: "Live tracking not available for this order yet.",
      });
    }

    const result = await trackDelhiveryShipment(order.shippingLabel.awbNumber);

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch tracking." },
      { status: 500 }
    );
  }
}