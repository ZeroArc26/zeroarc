import mongoose, { Schema, models, model } from "mongoose";

const ReviewSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    title: {
      type: String,
      trim: true,
      default: "",
    },

    comment: {
      type: String,
      required: true,
      trim: true,
    },

    images: {
      type: [String],
      default: [],
    },

    verifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// One review per customer per product.
ReviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

export interface IReview extends mongoose.Document {
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  verifiedPurchase: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default models.Review || model<IReview>("Review", ReviewSchema);
