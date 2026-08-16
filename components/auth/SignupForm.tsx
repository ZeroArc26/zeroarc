"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, UserPlus, ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Where to send the user after signing up — set by proxy.ts when it
  // redirects an unauthenticated visitor away from a protected route
  // like /checkout or /account. Only relative paths are trusted.
  const redirectParam = searchParams.get("redirect") || "/";
  const redirectTarget =
    redirectParam.startsWith("/") && !redirectParam.startsWith("//")
      ? redirectParam
      : "/";

  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [agree, setAgree] = useState(false);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      toast.error("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!agree) {
      toast.error("Please accept Terms & Conditions.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        return;
      }

      toast.success("Account created successfully!");

      router.push(redirectTarget);
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
        <div className="flex justify-center">
          <UserPlus className="h-6 w-6 text-violet-500" />
        </div>

        <h2 className="mt-3 text-center text-2xl font-black text-black">
          Create your account
        </h2>

        <p className="mt-1.5 text-center text-sm text-zinc-500">
          Join ZeroArc and start your journey
        </p>

        <form onSubmit={handleSignup} className="mt-8 space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-black">
                Full Name
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white py-3.5 pl-11 pr-4 text-sm text-black outline-none transition placeholder:text-zinc-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-black">
                Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white py-3.5 pl-11 pr-4 text-sm text-black outline-none transition placeholder:text-zinc-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-black">
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-white py-3.5 pl-11 pr-11 text-sm text-black outline-none transition placeholder:text-zinc-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-zinc-400">
              Use 8 or more characters with a mix of letters, numbers &
              symbols
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-black">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-white py-3.5 pl-11 pr-11 text-sm text-black outline-none transition placeholder:text-zinc-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <label className="flex items-start gap-2.5 text-sm text-zinc-600">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded accent-violet-600"
            />
            <span>
              I agree to the{" "}
              <Link href="/terms" className="font-medium text-violet-600 hover:text-violet-500">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="font-medium text-violet-600 hover:text-violet-500">
                Privacy Policy
              </Link>
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-zinc-200" />
          <span className="text-xs uppercase tracking-wide text-zinc-400">
            or continue with
          </span>
          <div className="h-px flex-1 bg-zinc-200" />
        </div>

        <button
          type="button"
          onClick={() => {
            window.location.href = `/api/auth/google?redirect=${encodeURIComponent(redirectTarget)}`;
          }}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-300 bg-white py-3.5 text-sm font-medium text-black transition hover:border-zinc-400 hover:bg-zinc-50"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt=""
            className="h-5 w-5"
          />
          Continue with Google
        </button>

        <p className="mt-7 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-violet-600 hover:text-violet-500"
          >
            Log in
          </Link>
        </p>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-violet-50 px-4 py-3 text-xs text-violet-700">
        <ShieldCheck className="h-4 w-4 shrink-0" />
        Your data is encrypted and secure with ZeroArc
      </div>
    </div>
  );
}
