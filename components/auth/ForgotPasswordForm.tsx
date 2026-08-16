"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Mail, Lock, ShieldCheck, ArrowLeft, ArrowRight } from "lucide-react";

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
    <div className="w-full max-w-md">
      <div className="rounded-[28px] border border-zinc-200 bg-white p-8 shadow-xl shadow-zinc-200/50 sm:p-10">
        {submitted ? (
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-50 text-violet-500">
              <Mail size={24} />
            </div>

            <h2 className="mt-4 text-2xl font-black text-black">
              Check your email
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              If an account exists with{" "}
              <span className="font-semibold text-black">{email}</span>,
              we&apos;ve sent a password reset link. It expires in 1 hour.
            </p>

            <Link
              href="/login"
              className="mt-8 inline-flex items-center gap-2 font-semibold text-violet-600 hover:text-violet-500"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-50 text-violet-500">
                <Lock className="h-5 w-5" />
              </div>
            </div>

            <h2 className="mt-3 text-center text-2xl font-black text-black">
              Forgot Password?
            </h2>

            <p className="mt-1.5 text-center text-sm text-zinc-500">
              No worries! Enter your email address and we&apos;ll send you
              a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-black">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 bg-white py-3.5 pl-11 pr-4 text-sm text-black outline-none transition placeholder:text-zinc-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Reset Link"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-zinc-200" />
              <span className="text-xs uppercase tracking-wide text-zinc-400">
                or
              </span>
              <div className="h-px flex-1 bg-zinc-200" />
            </div>

            <Link
              href="/login"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white py-3.5 text-sm font-medium text-black transition hover:border-zinc-400 hover:bg-zinc-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>

            <p className="mt-6 rounded-xl bg-violet-50 px-4 py-3 text-center text-xs leading-relaxed text-violet-700">
              If you don&apos;t receive the email within a few minutes,
              check your spam folder or try again.
            </p>
          </>
        )}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-violet-50 px-4 py-3 text-xs text-violet-700">
        <ShieldCheck className="h-4 w-4 shrink-0" />
        Your data is encrypted and secure with ZeroArc
      </div>
    </div>
  );
}
