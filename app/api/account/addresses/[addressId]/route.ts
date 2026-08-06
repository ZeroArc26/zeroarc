import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { getCurrentUser } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ addressId: string }>;
}

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    await connectDB();

    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { addressId } = await params;
    const body = await req.json();

    const customer = await Customer.findOne({ email: current.email });

    if (!customer) {
      return NextResponse.json(
        { success: false, message: "Customer not found." },
        { status: 404 }
      );
    }

    const target = customer.addresses.id(addressId);

    if (!target) {
      return NextResponse.json(
        { success: false, message: "Address not found." },
        { status: 404 }
      );
    }

    if (body.isDefault) {
      customer.addresses.forEach((a) => (a.isDefault = false));
    }

    target.label = body.label ?? target.label;
    target.name = body.name ?? target.name;
    target.phone = body.phone ?? target.phone;
    target.address = body.address ?? target.address;
    target.city = body.city ?? target.city;
    target.state = body.state ?? target.state;
    target.pincode = body.pincode ?? target.pincode;
    target.country = body.country ?? target.country;
    if (body.isDefault !== undefined) target.isDefault = body.isDefault;

    await customer.save();

    return NextResponse.json({ success: true, addresses: customer.addresses });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to update address." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    await connectDB();

    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { addressId } = await params;

    const customer = await Customer.findOne({ email: current.email });

    if (!customer) {
      return NextResponse.json(
        { success: false, message: "Customer not found." },
        { status: 404 }
      );
    }

    customer.addresses = customer.addresses.filter(
      (a) => a._id?.toString() !== addressId
    ) as any;

    await customer.save();

    return NextResponse.json({ success: true, addresses: customer.addresses });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to delete address." },
      { status: 500 }
    );
  }
}