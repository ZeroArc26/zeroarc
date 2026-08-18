"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Star, MessageSquarePlus, Quote } from "lucide-react";
import { toast } from "sonner";

import Reveal from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface SiteReview {
  _id: string;
  userId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex text-yellow-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-yellow-400" : "fill-none"}`}
        />
      ))}
    </div>
  );
}

export default function SiteTestimonials() {
  const pathname = usePathname();

  const [reviews, setReviews] = useState<SiteReview[]>([]);
  const [loading, setLoading] = useState(true);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

    fetch("/api/account/me")
      .then((res) => res.json())
      .then((data) => {
        setIsLoggedIn(!!data.success);
        if (data.success) setCurrentUserId(data.user.id);
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  const myReview = reviews.find((r) => r.userId === currentUserId);

  function openDialog() {
    if (myReview) {
      setRating(myReview.rating);
      setComment(myReview.comment);
    } else {
      setRating(0);
      setComment("");
    }
    setDialogOpen(true);
  }

  async function handleSubmit() {
    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please share a few words.");
      return;
    }

    setSubmitting(true);

    try {
      const url = myReview
        ? `/api/site-reviews/${myReview._id}`
        : "/api/site-reviews";

      const res = await fetch(url, {
        method: myReview ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(myReview ? "Review updated!" : "Thanks for sharing!");
      setDialogOpen(false);
      fetchReviews();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="bg-white px-6 py-16 md:px-14">
      <div className="mx-auto max-w-[1700px]">
        <Reveal className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="flex items-center gap-1 text-2xl font-black uppercase text-black">
            What Our Customers Say
            <span className="text-violet-600">+</span>
          </h2>

          {isLoggedIn === false ? (
            <Link
              href={`/login?redirect=${encodeURIComponent(pathname)}`}
              className="flex items-center gap-2 rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-black transition hover:border-violet-400"
            >
              Sign in to share your experience
            </Link>
          ) : (
            <button
              onClick={openDialog}
              disabled={isLoggedIn === null}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-50"
            >
              <MessageSquarePlus className="h-4 w-4" />
              {myReview ? "Edit Your Review" : "Share Your Experience"}
            </button>
          )}
        </Reveal>

        {loading ? (
          <p className="text-sm text-zinc-500">Loading...</p>
        ) : reviews.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 p-8 text-center">
            <p className="text-sm text-zinc-500">
              No reviews yet. Be the first to share your experience.
            </p>
          </div>
        ) : (
          <StaggerGroup
            gap={0.05}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {reviews.slice(0, 6).map((review) => (
              <StaggerItem
                key={review._id}
                className="rounded-2xl border border-zinc-200 bg-white p-6"
              >
                <Quote className="h-6 w-6 text-violet-200" />
                <StarRow rating={review.rating} />
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                  &ldquo;{review.comment}&rdquo;
                </p>
                <p className="mt-4 text-sm font-bold text-black">
                  — {review.customerName}
                </p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg border border-zinc-200 bg-white text-black sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-black">
              {myReview ? "Edit Your Review" : "Share Your Experience"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold text-zinc-600">
                How was your experience with ZeroArc?
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
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-none text-zinc-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-600">
                Your Review
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Tell other shoppers what you liked about ZeroArc"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-violet-500"
              />
            </div>
          </div>

          <DialogFooter className="bg-white">
            <button
              onClick={() => setDialogOpen(false)}
              className="rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60"
            >
              {submitting ? "Saving..." : myReview ? "Save Changes" : "Submit"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
