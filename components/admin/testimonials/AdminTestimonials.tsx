"use client";

import { useEffect, useState } from "react";
import { Star, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SiteReview {
  _id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function AdminTestimonials() {
  const [reviews, setReviews] = useState<SiteReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/site-reviews");
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
  }, []);

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Delete this testimonial? It will no longer show on the homepage."
    );
    if (!confirmed) return;

    setDeletingId(id);

    try {
      const res = await fetch(`/api/site-reviews/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Failed to delete testimonial.");
        return;
      }

      setReviews((prev) => prev.filter((r) => r._id !== id));
      toast.success("Testimonial deleted.");
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
          Homepage Testimonials
        </h3>
        <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1 text-sm font-medium text-violet-300">
          {reviews.length} testimonial{reviews.length !== 1 ? "s" : ""}
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8 text-zinc-500">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <p className="py-6 text-center text-sm text-zinc-500">
          No testimonials yet.
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
                  <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < review.rating ? "fill-yellow-400" : "fill-none"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-zinc-500">
                    {new Date(review.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <p className="mt-2 text-sm text-zinc-400">{review.comment}</p>

                <p className="mt-2 text-xs font-medium text-zinc-500">
                  — {review.customerName}
                </p>
              </div>

              <button
                onClick={() => handleDelete(review._id)}
                disabled={deletingId === review._id}
                className="shrink-0 rounded-lg p-2 text-zinc-500 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                title="Delete testimonial"
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
