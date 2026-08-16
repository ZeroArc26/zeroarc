"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Star, ShieldCheck, MessageSquarePlus, ImagePlus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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

interface ProductReviewsProps {
  productId: string;
}

function StarRow({
  rating,
  size = 16,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <div className="flex text-violet-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          width={size}
          height={size}
          className={i < Math.round(rating) ? "fill-violet-500" : "fill-none"}
        />
      ))}
    </div>
  );
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const pathname = usePathname();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    fetch("/api/account/me")
      .then((res) => res.json())
      .then((data) => setIsLoggedIn(!!data.success))
      .catch(() => setIsLoggedIn(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const reviewCount = reviews.length;
  const averageRating =
    reviewCount > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0;

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    return {
      star,
      count,
      percent: reviewCount > 0 ? (count / reviewCount) * 100 : 0,
    };
  });

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (reviewImages.length + files.length > 5) {
      toast.error("You can add up to 5 photos.");
      return;
    }

    setUploadingImages(true);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "reviews");

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (data.success && data.url) {
          setReviewImages((prev) => [...prev, data.url]);
        } else {
          toast.error("Failed to upload one of the photos.");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload photos.");
    } finally {
      setUploadingImages(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removeImage(url: string) {
    setReviewImages((prev) => prev.filter((img) => img !== url));
  }

  async function handleSubmit() {
    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a review.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, title, comment, images: reviewImages }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success("Review submitted!");
      setDialogOpen(false);
      setRating(0);
      setTitle("");
      setComment("");
      setReviewImages([]);
      fetchReviews();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-16">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-black uppercase text-black">
          Customer Reviews
        </h2>

        {isLoggedIn === false ? (
          <Link
            href={`/login?redirect=${encodeURIComponent(pathname)}`}
            className="flex items-center gap-2 rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-black transition hover:border-violet-400"
          >
            Sign in to write a review
          </Link>
        ) : (
          <button
            onClick={() => setDialogOpen(true)}
            disabled={isLoggedIn === null}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-50"
          >
            <MessageSquarePlus className="h-4 w-4" />
            Write a Review
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-zinc-500">Loading reviews...</p>
      ) : reviewCount === 0 ? (
        <div className="rounded-2xl border border-zinc-200 p-8 text-center">
          <p className="text-sm text-zinc-500">
            No reviews yet. Be the first to share your experience.
          </p>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="mb-8 grid grid-cols-1 gap-8 rounded-2xl border border-zinc-200 p-6 sm:grid-cols-[auto_1fr]">
            <div className="flex flex-col items-center justify-center sm:border-r sm:border-zinc-200 sm:pr-8">
              <p className="text-4xl font-black text-black">
                {averageRating.toFixed(1)}
              </p>
              <StarRow rating={averageRating} size={18} />
              <p className="mt-1 text-xs text-zinc-500">
                {reviewCount} review{reviewCount !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="space-y-1.5">
              {distribution.map(({ star, count, percent }) => (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <span className="w-10 shrink-0 text-zinc-500">
                    {star} star
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className="h-full rounded-full bg-violet-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-6 shrink-0 text-right text-zinc-400">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Review list */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="border-b border-zinc-100 pb-6 last:border-0"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <StarRow rating={review.rating} />
                    {review.verifiedPurchase && (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase text-emerald-700">
                        <ShieldCheck className="h-3 w-3" />
                        Verified Purchase
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-zinc-400">
                    {new Date(review.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {review.title && (
                  <p className="mt-2 text-sm font-bold text-black">
                    {review.title}
                  </p>
                )}

                <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                  {review.comment}
                </p>

                {review.images && review.images.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {review.images.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative h-16 w-16 overflow-hidden rounded-lg border border-zinc-200"
                      >
                        <Image src={url} alt="" fill className="object-cover" />
                      </a>
                    ))}
                  </div>
                )}

                <p className="mt-2 text-xs font-semibold text-zinc-500">
                  — {review.customerName}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg border border-zinc-200 bg-white text-black sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-black">Write a Review</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold text-zinc-600">
                Your Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={`h-7 w-7 ${
                        star <= (hoverRating || rating)
                          ? "fill-violet-500 text-violet-500"
                          : "fill-none text-zinc-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-600">
                Title (optional)
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Sum up your experience"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-violet-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-600">
                Your Review
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="What did you like or dislike?"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-violet-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-600">
                Add Photos (optional)
              </label>

              <div className="flex flex-wrap gap-3">
                {reviewImages.map((url) => (
                  <div
                    key={url}
                    className="relative h-16 w-16 overflow-hidden rounded-lg border border-zinc-200"
                  >
                    <Image src={url} alt="" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                {reviewImages.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImages}
                    className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-zinc-300 text-zinc-400 transition hover:border-violet-400 hover:text-violet-500 disabled:opacity-50"
                  >
                    {uploadingImages ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <ImagePlus className="h-5 w-5" />
                    )}
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />

              <p className="mt-1.5 text-xs text-zinc-400">
                Up to 5 photos
              </p>
            </div>
          </div>

          <DialogFooter className="bg-white">
            <button
              onClick={() => {
                setDialogOpen(false);
                setRating(0);
                setTitle("");
                setComment("");
                setReviewImages([]);
              }}
              className="rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
