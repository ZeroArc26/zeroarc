"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  changePasswordSchema,
  ChangePasswordInput,
} from "@/lib/validations/change-password";

export default function ChangePasswordForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  async function onSubmit(values: ChangePasswordInput) {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("/api/admin/change-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      setMessage(data.message);

      if (data.success) {
        reset();
      }
    } catch {
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
      <h2 className="mb-6 text-2xl font-bold">
        Change Password
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Current Password
          </label>

          <input
            type="password"
            {...register("currentPassword")}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3"
          />

          {errors.currentPassword && (
            <p className="mt-2 text-sm text-red-500">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            New Password
          </label>

          <input
            type="password"
            {...register("newPassword")}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3"
          />

          {errors.newPassword && (
            <p className="mt-2 text-sm text-red-500">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Confirm Password
          </label>

          <input
            type="password"
            {...register("confirmPassword")}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3"
          />

          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            disabled={loading}
            className="rounded-xl bg-violet-600 px-6 py-3 font-semibold transition hover:bg-violet-500 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>

        {message && (
          <p className="text-sm text-green-400">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}