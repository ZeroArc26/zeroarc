import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

// ======================
// Helpers
// ======================

function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ZA${timestamp}${random}`;
}

function generateInvoiceNumber() {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `INV${timestamp}${random}`;
}

function mapPaymentMethod(method: string) {
  const normalized = (method || "").toLowerCase();
  if (["upi", "card", "cod", "netbanking"].includes(normalized)) {
    return normalized;
  }
  // Fallback for the generic "ONLINE"/"COD" values sent by checkout.
  return normalized === "cod" ? "cod" : "upi";
}

// ======================
// Create Order
// ======================

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      customer,
      shippingAddress,
      paymentMethod,
      products = [],
      subtotal = 0,
      shipping = 0,
      discount = 0,
      total = 0,
    } = body;

    const fullName = [customer?.firstName, customer?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    const taxableAmount = Math.max(subtotal - discount, 0);
    const totalTax = Math.round(taxableAmount * 0.18 * 100) / 100;

    const orderDoc = {
      orderInfo: {
        orderNumber: generateOrderNumber(),
        status: "pending",
        source: "website",
      },

      customer: {
        name: fullName || "Guest",
        email: customer?.email || "",
        phone: customer?.phone || "",
        shippingAddress: {
          address: [shippingAddress?.address, shippingAddress?.landmark]
            .filter(Boolean)
            .join(", "),
          city: shippingAddress?.city,
          state: shippingAddress?.state,
          pincode: shippingAddress?.pincode,
          country: shippingAddress?.country || "India",
        },
        billingAddress: {
          address: [shippingAddress?.address, shippingAddress?.landmark]
            .filter(Boolean)
            .join(", "),
          city: shippingAddress?.city,
          state: shippingAddress?.state,
          pincode: shippingAddress?.pincode,
          country: shippingAddress?.country || "India",
        },
      },

      items: products.map((item: any) => ({
        productId: item.productId,
        name: item.title,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
        totalAmount: item.price * item.quantity,
      })),

      invoiceInfo: {
        invoiceNumber: generateInvoiceNumber(),
      },

      pricing: {
        subtotal,
        discount,
        taxableAmount,
        cgst: totalTax / 2,
        sgst: totalTax / 2,
        totalTax,
        grandTotal: total || taxableAmount + shipping,
      },

      payment: {
        method: mapPaymentMethod(paymentMethod),
        status: "pending",
      },
    };

    const order = await Order.create(orderDoc);

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create order",
      },
      {
        status: 500,
      }
    );
  }
}

// ======================
// Get All Orders
// ======================

export async function GET() {
  try {
    await connectDB();

    const orders = await Order.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch orders",
      },
      {
        status: 500,
      }
    );
  }
}