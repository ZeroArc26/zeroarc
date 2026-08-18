import mongoose, { Schema, models, model } from "mongoose";

const SiteReviewSchema = new Schema(
  {
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

    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// One site-wide testimonial per customer.
SiteReviewSchema.index({ userId: 1 }, { unique: true });

export interface ISiteReview extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export default models.SiteReview ||
  model<ISiteReview>("SiteReview", SiteReviewSchema);
