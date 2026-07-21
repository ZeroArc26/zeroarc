import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const order = await Order.create({
      ...body,

      orderId:
        "ZA-" +
        Date.now() +
        "-" +
        Math.floor(Math.random() * 1000),
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
        message: "Failed to create order.",
      },
      {
        status: 500,
      }
    );
  }
}