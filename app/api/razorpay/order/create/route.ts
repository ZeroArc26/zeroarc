import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

import {
  generateInvoiceNumber,
  generateOrderId,
  getInitialStatusHistory,
} from "@/lib/order";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const data = await req.json();

    const order = await Order.create({
      ...data,

      orderId: generateOrderId(),

      invoiceNumber: generateInvoiceNumber(),

      statusHistory: getInitialStatusHistory(),
    });

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create order",
      },
      {
        status: 500,
      }
    );
  }
}