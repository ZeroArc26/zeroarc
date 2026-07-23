import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const orders = await Order.find({
      "customer.email": decodeURIComponent(id),
    }).sort({
      createdAt: -1,
    });

    if (orders.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer not found",
        },
        {
          status: 404,
        }
      );
    }

    const customer = orders[0].customer;

    const shippingAddress = orders[0].shippingAddress;
        const totalOrders = orders.length;

    const totalSpent = orders.reduce(
      (sum, order) => sum + order.total,
      0
    );

    const averageOrderValue =
      totalSpent / totalOrders;

    return NextResponse.json({
      success: true,

      customer,

      shippingAddress,

      orders,

      stats: {
        totalOrders,
        totalSpent,
        averageOrderValue,
      },
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch customer",
      },
      {
        status: 500,
      }
    );
  }
}