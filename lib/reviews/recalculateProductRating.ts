import mongoose from "mongoose";

import Review from "@/models/Review";
import Product from "@/models/Product";

export async function recalculateProductRating(productId: string) {
  const stats = await Review.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  const { averageRating = 0, reviewCount = 0 } = stats[0] || {};

  await Product.findByIdAndUpdate(productId, {
    averageRating: Math.round(averageRating * 10) / 10,
    reviewCount,
  });
}
