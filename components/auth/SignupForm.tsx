"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

const [loading, setLoading] = useState(false);

const [fullName, setFullName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] =
  useState("");

const [agree, setAgree] = useState(false);

const handleSignup = async (
  e: React.FormEvent<HTMLFormElement>
) => {
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

    console.log("Signup button clicked");
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
    console.log(response.status);
console.log(data);

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    toast.success("Account created successfully!");

    router.push("/");
  } catch (error) {
    console.error(error);

    toast.error("Something went wrong.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-2xl">

      <h2 className="text-3xl font-black text-white">
        Create Account
      </h2>

      <p className="mt-2 text-sm text-zinc-400">
        Join ZEROARC today.
      </p>

      <form
  onSubmit={handleSignup}
  className="mt-8 space-y-5"
>

        <input
  type="text"
  placeholder="Full Name"
  value={fullName}
  onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
        />

        <input
  type="email"
  placeholder="Email Address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
        />

        <div className="relative">
          <input
  type={showPassword ? "text" : "password"}
  placeholder="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 pr-14 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="relative">
          <input
  type={showConfirm ? "text" : "password"}
  placeholder="Confirm Password"
  value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 pr-14 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
          />

          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <label className="flex items-start gap-3 text-sm text-zinc-400">
          <input
  type="checkbox"
  className="mt-1"
  checked={agree}
  onChange={(e) => setAgree(e.target.checked)}
/>
          <span>
            I agree to the Terms & Conditions and Privacy Policy.
          </span>
        </label>

        <button
          type="submit"
          className="w-full rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 py-4 font-semibold text-white transition hover:scale-[1.02]"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

      </form>

      <div className="my-8 flex items-center gap-4">
        <div className="h-px flex-1 bg-zinc-800" />
        <span className="text-sm text-zinc-500">OR</span>
        <div className="h-px flex-1 bg-zinc-800" />
      </div>

      <button
  type="button"
  onClick={() => {
    window.location.href = "/api/auth/google";
  }}
  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-zinc-700 bg-zinc-950 py-4 font-medium transition hover:border-purple-500"
>
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="h-5 w-5"
        />
        Continue with Google
      </button>

      <p className="mt-8 text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-purple-400 hover:text-purple-300"
        >
          Login
        </Link>
      </p>

    </div>
  );
}