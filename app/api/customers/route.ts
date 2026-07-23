import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET() {
  try {
    await connectDB();

    const orders = await Order.find({})
      .sort({ createdAt: -1 });

    const customerMap = new Map();

    for (const order of orders) {
      const email = order.customer.email;

      if (!customerMap.has(email)) {
        customerMap.set(email, {
          customer: order.customer,

          totalOrders: 0,

          totalSpent: 0,

          lastOrder: order.createdAt,

          firstOrder: order.createdAt,
        });
      }

      const customer = customerMap.get(email);

      customer.totalOrders += 1;

      customer.totalSpent += order.total;

      if (
        new Date(order.createdAt) >
        new Date(customer.lastOrder)
      ) {
        customer.lastOrder = order.createdAt;
      }

      if (
        new Date(order.createdAt) <
        new Date(customer.firstOrder)
      ) {
        customer.firstOrder = order.createdAt;
      }
    }

        const customers = Array.from(customerMap.values());

    return NextResponse.json({
      success: true,
      customers,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch customers",
      },
      {
        status: 500,
      }
    );
  }
}