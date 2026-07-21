import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const { status } = await req.json();

    console.log("========== UPDATE ORDER ==========");
    console.log("Order ID:", id);
    console.log("New Status:", status);

    const order = await Order.findByIdAndUpdate(
      id,
      {
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    console.log("Updated Order:", order);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });

  } catch (error) {
    console.error("PATCH ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update order",
      },
      {
        status: 500,
      }
    );
  }
}