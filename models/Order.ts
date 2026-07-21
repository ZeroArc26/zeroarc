import mongoose, { Schema, models, model } from "mongoose";

const OrderSchema = new Schema(
  {
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
      address: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      pincode: {
        type: String,
        required: true,
      },

      country: {
        type: String,
        required: true,
      },
    },

    products: [
      {
        productId: String,

        title: String,

        slug: String,

        image: String,

        color: String,

        size: String,

        quantity: Number,

        price: Number,
      },
    ],

    totalItems: Number,

    subtotal: Number,

    shipping: Number,

    total: Number,

    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Packed",
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

export default models.Order ||
  model("Order", OrderSchema);