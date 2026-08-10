"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Something went wrong.");
        return;
      }

      setSubmitted(true);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-2xl transition-all duration-500 hover:border-purple-500/40">
      {submitted ? (
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/15 text-violet-400">
            <Mail size={24} />
          </div>

          <h2 className="text-2xl font-black text-white">Check your email</h2>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            If an account exists with <span className="text-white">{email}</span>,
            we've sent a password reset link. It expires in 1 hour.
          </p>

          <Link
            href="/login"
            className="mt-8 inline-block font-semibold text-purple-400 hover:text-purple-300"
          >
            Back to Login
          </Link>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-black text-white">Forgot Password?</h2>

          <p className="mt-2 text-sm text-zinc-400">
            Enter your email and we'll send you a reset link.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 py-4 font-semibold text-white transition hover:scale-[1.02] disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-500">
            Remembered your password?{" "}
            <Link
              href="/login"
              className="font-semibold text-purple-400 hover:text-purple-300"
            >
              Back to Login
            </Link>
          </p>
        </>
      )}
    </div>
  );
}