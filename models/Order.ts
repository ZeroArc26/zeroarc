import mongoose, { Schema, models, model } from "mongoose";

const OrderSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    customer: {
      firstName: {
        type: String,
        required: true,
      },

      lastName: {
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

    shippingAddress: {
      address: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
    },

    products: [
      {
        productId: String,

        title: String,

        image: String,

        color: String,

        size: String,

        price: Number,

        quantity: Number,
      },
    ],

    totalItems: Number,

    subtotal: Number,

    shipping: Number,

    total: Number,

    paymentMethod: {
      type: String,
      default: "Razorpay",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

export default models.Order || model("Order", OrderSchema);