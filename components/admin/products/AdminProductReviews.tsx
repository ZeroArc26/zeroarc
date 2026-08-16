"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star, ShieldCheck, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Review {
  _id: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  verifiedPurchase: boolean;
  createdAt: string;
}

interface AdminProductReviewsProps {
  productId: string;
}

export default function AdminProductReviews({
  productId,
}: AdminProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/products/${productId}/reviews`);
      const data = await res.json();
      if (data.success) setReviews(data.reviews);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  async function handleDelete(reviewId: string) {
    const confirmed = window.confirm(
      "Delete this review permanently? The product's rating will be recalculated."
    );
    if (!confirmed) return;

    setDeletingId(reviewId);

    try {
      const res = await fetch(
        `/api/products/${productId}/reviews/${reviewId}`,
        { method: "DELETE" }
      );
      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Failed to delete review.");
        return;
      }

      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      toast.success("Review deleted.");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Customer Reviews
        </h3>
        <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1 text-sm font-medium text-violet-300">
          {reviews.length} review{reviews.length !== 1 ? "s" : ""}
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8 text-zinc-500">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <p className="py-6 text-center text-sm text-zinc-500">
          No reviews for this product yet.
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="flex items-start justify-between gap-4 rounded-xl border border-zinc-800 p-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex text-violet-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < review.rating ? "fill-violet-400" : "fill-none"
                        }`}
                      />
                    ))}
                  </div>
                  {review.verifiedPurchase && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-400">
                      <ShieldCheck className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                  <span className="text-xs text-zinc-500">
                    {new Date(review.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {review.title && (
                  <p className="mt-2 text-sm font-semibold text-white">
                    {review.title}
                  </p>
                )}

                <p className="mt-1 text-sm text-zinc-400">{review.comment}</p>

                {review.images && review.images.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {review.images.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative h-14 w-14 overflow-hidden rounded-lg border border-zinc-800"
                      >
                        <Image src={url} alt="" fill className="object-cover" />
                      </a>
                    ))}
                  </div>
                )}

                <p className="mt-2 text-xs font-medium text-zinc-500">
                  — {review.customerName}
                </p>
              </div>

              <button
                onClick={() => handleDelete(review._id)}
                disabled={deletingId === review._id}
                className="shrink-0 rounded-lg p-2 text-zinc-500 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                title="Delete review"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
