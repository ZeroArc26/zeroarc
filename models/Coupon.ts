import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICouponUsage {
  email: string;
  count: number;
}

export interface ICoupon extends Document {
  code: string;
  description?: string;

  discountType: "percentage" | "fixed";
  discountValue: number;

  minOrderValue: number;
  maxDiscountAmount?: number;

  usageLimit?: number;
  usedCount: number;

  perCustomerLimit?: number;
  usedBy: ICouponUsage[];

  expiryDate?: Date;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const CouponUsageSchema = new Schema<ICouponUsage>(
  {
    email: { type: String, required: true, lowercase: true },
    count: { type: Number, default: 0 },
  },
  { _id: false }
);

const CouponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },

    minOrderValue: {
      type: Number,
      default: 0,
      min: 0,
    },

    maxDiscountAmount: {
      type: Number,
      min: 0,
    },

    usageLimit: {
      type: Number,
      min: 0,
    },

    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    perCustomerLimit: {
      type: Number,
      min: 0,
    },

    usedBy: {
      type: [CouponUsageSchema],
      default: [],
    },

    expiryDate: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

CouponSchema.index({ isActive: 1 });
CouponSchema.index({ expiryDate: 1 });

const Coupon: Model<ICoupon> =
  mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema);

export default Coupon;