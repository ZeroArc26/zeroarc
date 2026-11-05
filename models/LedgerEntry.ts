import mongoose, { Schema, models } from "mongoose";

/**
 * Manual accounts ("hisaab") entry — kharcha, extra aamdani, stock kharidi
 * and udhaar. Website orders are NOT stored here; the summary reads them
 * straight from the Order collection.
 */
const LedgerEntrySchema = new Schema(
  {
    type: {
      type: String,
      enum: ["expense", "income", "purchase", "receivable", "payable"],
      required: true,
      index: true,
    },

    // Stored as 12:00 IST of the chosen day so date-range queries never
    // slip across midnight.
    date: { type: Date, required: true, index: true },

    amount: { type: Number, required: true, min: 0.01 },

    category: { type: String, trim: true, default: "" },
    title: { type: String, trim: true, default: "" },
    party: { type: String, trim: true, default: "" },
    quantity: Number,
    paymentMode: {
      type: String,
      enum: ["cash", "upi", "bank", "card", "other"],
      default: "upi",
    },
    note: { type: String, trim: true, default: "" },

    // Only meaningful for receivable / payable (udhaar).
    status: { type: String, enum: ["pending", "settled"], default: "settled" },
    dueDate: Date,
    settledAt: Date,

    createdBy: String,
  },
  { timestamps: true }
);

LedgerEntrySchema.index({ type: 1, status: 1 });

const LedgerEntry = models.LedgerEntry || mongoose.model("LedgerEntry", LedgerEntrySchema);

export default LedgerEntry;
