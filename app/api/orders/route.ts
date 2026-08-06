import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";

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
  return normalized === "cod" ? "cod" : "upi";
}

function round2(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
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

    // ------------------------------------------------------------
    // Prices are GST-INCLUSIVE (confirmed): the number the customer
    // sees/pays already contains 18% GST. So we back-calculate the
    // taxable (pre-GST) base from the final price instead of adding
    // GST on top of it.
    // ------------------------------------------------------------
    const priceAfterDiscount = Math.max(subtotal - discount, 0);
    const taxableAmount = round2(priceAfterDiscount / 1.18);
    const totalTax = round2(priceAfterDiscount - taxableAmount);

    // Interstate vs intrastate: compares customer's shipping state to
    // the company's registered state (see lib/pdf/company.ts -> state).
    const COMPANY_STATE = "West Bengal";
    const isInterState =
      (shippingAddress?.state || "").trim().toLowerCase() !==
      COMPANY_STATE.toLowerCase();

    // Build items: look up each variant's SKU from the Product's
    // variants[] array (SKU lives on the product, not the cart item),
    // and copy color/size straight from the cart item.
    const items = await Promise.all(
      products.map(async (item: any) => {
        let sku = "";

        try {
          const product = await Product.findById(item.productId).lean<any>();
          const variant = product?.variants?.find(
            (v: any) => v.color === item.color && v.size === item.size
          );
          sku = variant?.sku || "";
        } catch {
          sku = "";
        }

        const lineTotal = item.price * item.quantity;
        const lineTaxable = round2(lineTotal / 1.18);
        const lineGst = round2(lineTotal - lineTaxable);

        return {
          productId: item.productId,
          name: item.title,
          image: item.image,
          sku,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
          gstRate: 18,
          gstAmount: lineGst,
          totalAmount: lineTotal,
        };
      })
    );

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

      items,

      invoiceInfo: {
        invoiceNumber: generateInvoiceNumber(),
      },

      timeline: [
        {
          event: "Order Created",
          date: new Date(),
        },
      ],

      pricing: {
        subtotal,
        discount,
        taxableAmount,
        cgst: isInterState ? 0 : round2(totalTax / 2),
        sgst: isInterState ? 0 : round2(totalTax / 2),
        igst: isInterState ? totalTax : 0,
        totalTax,
        // Shipping is added on top; GST is already embedded inside
        // priceAfterDiscount, so we don't add totalTax again here.
        grandTotal: total || round2(priceAfterDiscount + shipping),
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