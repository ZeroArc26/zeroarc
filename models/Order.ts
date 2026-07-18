import mongoose, { Schema, models, model } from "mongoose";

const OrderSchema = new Schema(
  {
    // ===========================
    // ORDER INFORMATION
    // ===========================

    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    invoiceNumber: {
      type: String,
      default: "",
    },

    // ===========================
    // PAYMENT
    // ===========================

    paymentId: {
      type: String,
      required: true,
    },

    razorpayOrderId: {
      type: String,
      required: true,
    },

    paymentMethod: {
      type: String,
      default: "Razorpay",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "paid",
    },

    // ===========================
    // CUSTOMER
    // ===========================

    customer: {
      fullName: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },
    },

    // ===========================
    // SHIPPING ADDRESS
    // ===========================

    shippingAddress: {
      fullName: String,
      phone: String,
      email: String,

      house: String,
      street: String,
      landmark: String,

      city: String,
      state: String,
      pincode: String,
      country: String,

      instructions: String,
    },

    // ===========================
    // PRODUCTS
    // ===========================

    items: [
      {
        productId: Number,

        slug: String,

        name: String,

        sku: String,

        variantId: String,

        color: String,

        size: String,

        image: String,

        quantity: Number,

        price: Number,
      },
    ],

    // ===========================
    // PRICE DETAILS
    // ===========================

    subtotal: {
      type: Number,
      required: true,
    },

    shipping: {
      type: Number,
      required: true,
    },

    total: {
      type: Number,
      required: true,
    },

    // ===========================
    // SHIPPING DETAILS
    // ===========================

    courier: {
      type: String,
      default: "",
    },

    trackingNumber: {
      type: String,
      default: "",
    },

    // ===========================
    // ORDER STATUS
    // ===========================

    orderStatus: {
      type: String,
      enum: [
        "processing",
        "packed",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "processing",
    },

    statusHistory: [
      {
        status: {
          type: String,
        },

        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ===========================
    // NOTES
    // ===========================

    adminNotes: {
      type: String,
      default: "",
    },

    customerNotes: {
      type: String,
      default: "",
    },

    // ===========================
    // SOFT DELETE
    // ===========================

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Order =
  models.Order || model("Order", OrderSchema);

export default Order;