import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();

    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const customer = await Customer.findOne({ email: current.email });

    return NextResponse.json({
      success: true,
      addresses: customer?.addresses || [],
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch addresses." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { label, name, phone, address, city, state, pincode, country, isDefault } = body;

    if (!label || !name || !phone || !address || !city || !state || !pincode) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    let customer = await Customer.findOne({ email: current.email });

    if (!customer) {
      // First address ever added before any order was placed — create
      // a minimal Customer record now, rest fills in at first checkout.
      customer = await Customer.create({
        userId: current.id,
        name: current.fullName,
        email: current.email,
        phone,
        address: { address, city, state, pincode, country: country || "India" },
        addresses: [],
      });
    }

    if (isDefault) {
      customer.addresses.forEach((a) => (a.isDefault = false));
    }

    customer.addresses.push({
      label,
      name,
      phone,
      address,
      city,
      state,
      pincode,
      country: country || "India",
      isDefault: isDefault || customer.addresses.length === 0,
    });

    await customer.save();

    return NextResponse.json({
      success: true,
      addresses: customer.addresses,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to add address." },
      { status: 500 }
    );
  }
}