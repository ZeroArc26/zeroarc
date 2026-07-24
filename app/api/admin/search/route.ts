import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";

import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const q = searchParams.get("q") || "";

    if (!q.trim()) {
      return NextResponse.json({
        success: true,
        products: [],
        orders: [],
        customers: [],
      });
    }

    const regex = new RegExp(q, "i");

    const products = await Product.find({
      title: regex,
    })
      .limit(5)
      .select("title");

    const orders = await Order.find({
      orderNumber: regex,
    })
      .limit(5)
      .select("orderNumber");

    const customers = await User.find({
      role: "customer",
      $or: [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
      ],
    })
      .limit(5)
      .select("firstName lastName email");

    return NextResponse.json({
      success: true,
      products,
      orders,
      customers,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}