import mongoose, { Schema, models, model } from "mongoose";

const OrderSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    paymentId: {
      type: String,
      required: true,
    },

    razorpayOrderId: {
      type: String,
      required: true,
    },

    customer: {
      name: String,
      email: String,
      phone: String,
    },

    items: [
      {
        productId: Number,
        slug: String,
        name: String,

        variantId: String,
        color: String,
        size: String,

        image: String,

        quantity: Number,
        price: Number,
      },
    ],

    subtotal: Number,
    shipping: Number,
    total: Number,

    paymentStatus: {
      type: String,
      default: "paid",
    },

    orderStatus: {
      type: String,
      default: "processing",
    },
  },
  {
    timestamps: true,
  }
);

const Order =
  models.Order || model("Order", OrderSchema);

export default Order;