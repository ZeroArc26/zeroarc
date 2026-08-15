import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Customer from "@/models/Customer";
import { getCurrentUser } from "@/lib/auth";
import mongoose from "mongoose";
import { getStoreSettings } from "@/lib/settings";

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

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Please sign in to place an order.",
        },
        { status: 401 }
      );
    }

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
      couponCode,
      paymentResult,
    } = body;

    const fullName = [customer?.firstName, customer?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    const priceAfterDiscount = Math.max(subtotal - discount, 0);
    const taxableAmount = round2(priceAfterDiscount / 1.18);
    const totalTax = round2(priceAfterDiscount - taxableAmount);

    const settings = await getStoreSettings();
    const COMPANY_STATE = settings.tax?.companyState || "West Bengal";
    const isInterState =
      (shippingAddress?.state || "").trim().toLowerCase() !==
      COMPANY_STATE.toLowerCase();

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

    const grandTotal = total || round2(priceAfterDiscount + shipping);

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
        grandTotal,
      },

      payment: {
        method: mapPaymentMethod(paymentMethod),
        status: paymentResult?.razorpayPaymentId ? "paid" : "pending",
        transactionId: paymentResult?.razorpayPaymentId || undefined,
      },
    };

    const order = await Order.create(orderDoc);

    // ------------------------------------------------------------
    // Sync the Customer collection. If the shopper is logged in,
    // link via userId; otherwise match/create by email. This never
    // blocks order creation — a Customer-sync failure is logged but
    // the order itself has already been placed successfully.
    // ------------------------------------------------------------
    try {
      const customerEmail = (customer?.email || "").toLowerCase();

      if (customerEmail || customer?.phone) {
        const existing = await Customer.findOne(
          customerEmail
            ? { email: customerEmail }
            : { phone: customer?.phone }
        );

        const addressUpdate = {
          address: [shippingAddress?.address, shippingAddress?.landmark]
            .filter(Boolean)
            .join(", "),
          city: shippingAddress?.city,
          state: shippingAddress?.state,
          pincode: shippingAddress?.pincode,
          country: shippingAddress?.country || "India",
        };

        if (existing) {
          existing.name = fullName || existing.name;
          existing.phone = customer?.phone || existing.phone;
          existing.address = addressUpdate;
          existing.totalOrders = (existing.totalOrders || 0) + 1;
          existing.totalSpent = (existing.totalSpent || 0) + grandTotal;
          existing.lastOrderAt = new Date();
          if (currentUser?.id && !existing.userId) {
            existing.userId = new mongoose.Types.ObjectId(currentUser.id);
          }
          await existing.save();
        } else {
          await Customer.create({
            userId: currentUser?.id
              ? new mongoose.Types.ObjectId(currentUser.id)
              : undefined,
            name: fullName || "Guest",
            email: customerEmail,
            phone: customer?.phone || "",
            address: addressUpdate,
            totalOrders: 1,
            totalSpent: grandTotal,
            lastOrderAt: new Date(),
          });
        }
      }
    } catch (customerSyncError) {
      console.error("Customer sync failed:", customerSyncError);
    }

    // ------------------------------------------------------------
    // Track coupon usage. Best-effort — never blocks order creation.
    // ------------------------------------------------------------
    if (couponCode) {
      try {
        const Coupon = (await import("@/models/Coupon")).default;
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

        if (coupon) {
          coupon.usedCount += 1;

          const email = (customer?.email || "").toLowerCase();
          if (email) {
            const usage = coupon.usedBy.find((u: any) => u.email === email);
            if (usage) {
              usage.count += 1;
            } else {
              coupon.usedBy.push({ email, count: 1 });
            }
          }

          await coupon.save();
        }
      } catch (couponError) {
        console.error("Coupon usage tracking failed:", couponError);
      }
    }

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