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

interface ManualOrderItemInput {
  productId: string;
  title: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  customDesignImage?: string;
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    await connectDB();

    const body = await request.json();
    const {
      items,
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      notes,
    }: {
      items: ManualOrderItemInput[];
      customerName: string;
      customerPhone: string;
      customerEmail?: string;
      shippingAddress: {
        address: string;
        city: string;
        state: string;
        pincode: string;
        country?: string;
      };
      paymentMethod: string;
      paymentStatus: "paid" | "pending";
      notes?: string;
    } = body;

    if (!customerName?.trim() || !customerPhone?.trim()) {
      return NextResponse.json(
        { success: false, message: "Customer name and phone are required." },
        { status: 400 }
      );
    }

    if (
      !shippingAddress?.address?.trim() ||
      !shippingAddress?.city?.trim() ||
      !shippingAddress?.state?.trim() ||
      !shippingAddress?.pincode?.trim()
    ) {
      return NextResponse.json(
        { success: false, message: "A complete shipping address is required." },
        { status: 400 }
      );
    }

    if (!items?.length) {
      return NextResponse.json(
        { success: false, message: "Add at least one item to the order." },
        { status: 400 }
      );
    }

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

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const productDoc = productDocs[i];
      const variant = productDoc.variants.find(
        (v: any) => v.color === item.color && v.size === item.size
      );
      variant.stock = Math.max(variant.stock - item.quantity, 0);
      await productDoc.save();
    }

    const orderItems = items.map((item, i) => {
      const lineTotal = round2(item.price * item.quantity);
      const lineTaxable = round2(lineTotal / 1.18);
      const lineGst = round2(lineTotal - lineTaxable);

      const productDoc = productDocs[i];
      const coverImage =
        productDoc?.images?.find((img: { isCover?: boolean }) => img.isCover)?.url ||
        productDoc?.images?.[0]?.url ||
        "";

      return {
        productId: item.productId,
        name: item.title,
        image: item.customDesignImage || coverImage,
        sku: productDoc?.inventory?.sku || "",
        barcode: productDoc?.inventory?.barcode || "",
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

    // GST split depends on whether the customer's state matches the
    // company's registered state — same logic used for online orders.
    const settings = await getStoreSettings();
    const COMPANY_STATE = settings.tax?.companyState || "West Bengal";
    const isInterState =
      (shippingAddress.state || "").trim().toLowerCase() !== COMPANY_STATE.toLowerCase();

    const order = await Order.create({
      orderInfo: {
        orderNumber: generateOrderNumber(),
        status: "confirmed",
        source: "admin",
      },

      customer: {
        name: customerName.trim(),
        phone: customerPhone.trim(),
        email: customerEmail?.trim() || "",
        shippingAddress: {
          address: shippingAddress.address.trim(),
          city: shippingAddress.city.trim(),
          state: shippingAddress.state.trim(),
          pincode: shippingAddress.pincode.trim(),
          country: shippingAddress.country?.trim() || "India",
        },
        billingAddress: {
          address: shippingAddress.address.trim(),
          city: shippingAddress.city.trim(),
          state: shippingAddress.state.trim(),
          pincode: shippingAddress.pincode.trim(),
          country: shippingAddress.country?.trim() || "India",
        },
      },

      items: orderItems,

      invoiceInfo: {
        invoiceNumber: generateInvoiceNumber(),
      },

      timeline: [
        {
          event: "Order Placed (Manual — Admin)",
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
        method: paymentMethod || "cod",
        status: paymentStatus || "pending",
      },

      adminNotes: notes?.trim()
        ? [{ note: notes.trim(), createdAt: new Date() }]
        : [],
    });

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
          email: customerEmail?.trim() || "",
          totalOrders: 1,
          totalSpent: subtotal,
          lastOrderAt: new Date(),
        });
      }
    } catch (err) {
      console.error("Manual order Customer sync failed (non-blocking):", err);
    }

    return NextResponse.json({
      success: true,
      orderId: order._id.toString(),
      orderNumber: order.orderInfo.orderNumber,
    });
  } catch (error: any) {
    if (error?.message === "Unauthorized") {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }
    console.error("MANUAL ORDER CREATE ERROR:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to create order." },
      { status: 500 }
    );
  }
}
