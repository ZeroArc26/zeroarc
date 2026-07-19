"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        return;
      }

      toast.success("Login successful!");

      console.log(data.user);

      router.push("/");
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-2xl transition-all duration-500 hover:border-purple-500/40">

      <h2 className="text-3xl font-black text-white">
        Login
      </h2>

      <p className="mt-2 text-sm text-zinc-400">
        Welcome back to ZEROARC.
      </p>

      <form
        onSubmit={handleLogin}
        className="mt-8 space-y-5"
      >

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
            {showPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>

        </div>

        <div className="flex items-center justify-between text-sm">

          <label className="flex items-center gap-2 text-zinc-400">

            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) =>
                setRememberMe(e.target.checked)
              }
            />

            Remember me

          </label>

          <Link
            href="/forgot-password"
            className="text-purple-400 hover:text-purple-300"
          >
            Forgot Password?
          </Link>

        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 py-4 font-semibold text-white transition hover:scale-[1.02] disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>

      <div className="my-8 flex items-center gap-4">

        <div className="h-px flex-1 bg-zinc-800" />

        <span className="text-sm text-zinc-500">
          OR
        </span>

        <div className="h-px flex-1 bg-zinc-800" />

      </div>

      <button
        type="button"
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
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-purple-400 hover:text-purple-300"
        >
          Create Account
        </Link>
      </p>

    </div>
  );
}