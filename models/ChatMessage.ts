import mongoose, { Schema, models } from "mongoose";

const ChatMessageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    sender: {
      type: String,
      enum: ["customer", "admin", "ai"],
      required: true,
    },

    senderName: {
      type: String,
      default: "",
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    quickReplies: {
      type: [String],
      default: [],
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

ChatMessageSchema.index({ conversationId: 1, createdAt: 1 });

export default models.ChatMessage ||
  mongoose.model("ChatMessage", ChatMessageSchema);
