import mongoose, { Schema, models } from "mongoose";

const SupportTicketSchema = new Schema(
  {
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    customerEmail: {
      type: String,
      trim: true,
    },

    // Snapshot of the chat transcript at the moment the ticket was
    // raised — admin-only context, never shown to the customer.
    transcript: [
      {
        sender: String,
        senderName: String,
        text: String,
        createdAt: Date,
      },
    ],

    // The customer's actual issue, extracted from their last message
    // before raising the ticket — this (not the full transcript) is
    // what the customer sees on their My Tickets page.
    mainProblem: {
      type: String,
      default: "",
    },

    // A separate, simple reply thread just for this ticket — admin
    // writes here, customer sees it directly on their ticket (not
    // through Live Chat).
    replies: [
      {
        sender: { type: String, enum: ["admin", "customer"] },
        senderName: String,
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],

    status: {
      type: String,
      enum: ["open", "in_progress", "resolved"],
      default: "open",
    },

    // Set true whenever admin adds a reply, cleared once the customer
    // has been shown/notified about it (even if they weren't on the
    // site at the time — this lets a "you have a new reply" toast
    // surface the next time they visit, not just in real-time).
    hasUnreadReply: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default models.SupportTicket ||
  mongoose.model("SupportTicket", SupportTicketSchema);
