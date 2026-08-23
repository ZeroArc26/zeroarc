import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Customer from "@/models/Customer";
import { requireAdmin } from "@/lib/auth/admin";
import { getStoreSettings } from "@/lib/settings";

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

function round2(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

interface SaleItemInput {
  productId: string;
  title: string;
  image?: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    await connectDB();

    const body = await request.json();
    const {
      items,
      customerName,
      customerPhone,
      paymentMethod, // "cash" | "upi" | "card"
    }: {
      items: SaleItemInput[];
      customerName: string;
      customerPhone: string;
      paymentMethod: string;
    } = body;

    if (!customerName?.trim() || !customerPhone?.trim()) {
      return NextResponse.json(
        { success: false, message: "Customer name and phone are required." },
        { status: 400 }
      );
    }

    if (!items?.length) {
      return NextResponse.json(
        { success: false, message: "No items in the sale." },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // Validate stock for every line item BEFORE touching anything.
    // ------------------------------------------------------------
    const productDocs = await Promise.all(
      items.map((item) => Product.findById(item.productId))
    );

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const productDoc = productDocs[i];

      if (!productDoc) {
        return NextResponse.json(
          { success: false, message: `Product not found: ${item.title}` },
          { status: 404 }
        );
      }

      const variant = productDoc.variants.find(
        (v: any) => v.color === item.color && v.size === item.size
      );

      if (!variant || variant.stock < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `Not enough stock for ${item.title} (${item.color}, ${item.size}). Available: ${variant?.stock ?? 0}`,
          },
          { status: 400 }
        );
      }
    }

    // ------------------------------------------------------------
    // Decrement stock for every line item.
    // ------------------------------------------------------------
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const productDoc = productDocs[i];

      const variant = productDoc.variants.find(
        (v: any) => v.color === item.color && v.size === item.size
      );

      variant.stock = Math.max(variant.stock - item.quantity, 0);
      await productDoc.save();
    }

    // ------------------------------------------------------------
    // Build order items + pricing (GST-inclusive pricing, same as
    // the online checkout flow).
    // ------------------------------------------------------------
    const settings = await getStoreSettings();
    // Offline/in-store sale — always the same state as the shop, so
    // it's always CGST+SGST, never IGST.
    const isInterState = false;

    const orderItems = items.map((item, i) => {
      const lineTotal = round2(item.price * item.quantity);
      const lineTaxable = round2(lineTotal / 1.18);
      const lineGst = round2(lineTotal - lineTaxable);

      return {
        productId: item.productId,
        name: item.title,
        image: item.image || "",
        sku: productDocs[i]?.inventory?.sku || "",
        barcode: productDocs[i]?.inventory?.barcode || "",
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
        gstRate: 18,
        gstAmount: lineGst,
        totalAmount: lineTotal,
      };
    });

    const subtotal = round2(orderItems.reduce((sum, i) => sum + i.totalAmount, 0));
    const taxableAmount = round2(subtotal / 1.18);
    const totalTax = round2(subtotal - taxableAmount);

    const paymentMethodMap: Record<string, string> = {
      cash: "cash",
      upi: "upi",
      card: "card",
    };

    const orderDoc = {
      orderInfo: {
        orderNumber: generateOrderNumber(),
        status: "delivered", // handed over in-person, no shipping involved
        source: "pos",
      },

      customer: {
        name: customerName.trim(),
        phone: customerPhone.trim(),
        email: "",
      },

      items: orderItems,

      invoiceInfo: {
        invoiceNumber: generateInvoiceNumber(),
      },

      timeline: [
        {
          event: "Offline Sale Completed (In-Store)",
          date: new Date(),
        },
      ],

      pricing: {
        subtotal,
        discount: 0,
        taxableAmount,
        cgst: isInterState ? 0 : round2(totalTax / 2),
        sgst: isInterState ? 0 : round2(totalTax / 2),
        igst: isInterState ? totalTax : 0,
        totalTax,
        grandTotal: subtotal,
      },

      payment: {
        method: paymentMethodMap[paymentMethod] || "cash",
        status: "paid",
        transactionId: undefined,
      },
    };

    const order = await Order.create(orderDoc);

    // Best-effort Customer sync (mirrors the online checkout route) —
    // never blocks the sale if it fails.
    try {
      const existing = await Customer.findOne({ phone: customerPhone.trim() });

      if (existing) {
        existing.name = customerName.trim() || existing.name;
        existing.totalOrders = (existing.totalOrders || 0) + 1;
        existing.totalSpent = (existing.totalSpent || 0) + subtotal;
        existing.lastOrderAt = new Date();
        await existing.save();
      } else {
        await Customer.create({
          name: customerName.trim(),
          phone: customerPhone.trim(),
          totalOrders: 1,
          totalSpent: subtotal,
          lastOrderAt: new Date(),
        });
      }
    } catch (err) {
      console.error("POS Customer sync failed (non-blocking):", err);
    }

    return NextResponse.json({
      success: true,
      orderId: order._id.toString(),
      orderNumber: order.orderInfo.orderNumber,
      invoiceNumber: order.invoiceInfo.invoiceNumber,
      order: {
        orderNumber: order.orderInfo.orderNumber,
        invoiceNumber: order.invoiceInfo.invoiceNumber,
        date: order.orderInfo.orderDate,
        customer: order.customer,
        items: order.items,
        pricing: order.pricing,
        payment: order.payment,
        soldBy: admin?.name || "",
      },
    });
  } catch (error: any) {
    if (error?.message === "Unauthorized") {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    console.error("POS COMPLETE SALE ERROR:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to complete sale." },
      { status: 500 }
    );
  }
}
