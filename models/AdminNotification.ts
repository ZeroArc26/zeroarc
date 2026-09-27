import mongoose, { Schema, models } from "mongoose";

const AdminNotificationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["order", "low_stock", "customer", "chat", "ticket"],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    // Where clicking this notification should take the admin.
    link: {
      type: String,
      default: "",
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

AdminNotificationSchema.index({ createdAt: -1 });

export default models.AdminNotification ||
  mongoose.model("AdminNotification", AdminNotificationSchema);
