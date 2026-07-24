"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import useCurrentAdmin from "@/hooks/useCurrentAdmin";

import {
  updateAdminProfileSchema,
  UpdateAdminProfileInput,
} from "@/lib/validations/admin-profile";

export default function ProfileForm() {
  const { admin } = useCurrentAdmin();

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateAdminProfileInput>({
    resolver: zodResolver(updateAdminProfileSchema),
  });

  useEffect(() => {
    if (admin) {
      reset({
        name: admin.name,
      });
    }
  }, [admin, reset]);

  async function onSubmit(values: UpdateAdminProfileInput) {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

if (data.success) {
  setMessage(data.message);
  router.refresh();
} else {
  setMessage(data.message);
}
    } catch {
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div>
        <label className="mb-2 block text-sm text-zinc-400">
          Name
        </label>

        <input
          {...register("name")}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3"
        />

        {errors.name && (
          <p className="mt-2 text-sm text-red-500">
            {errors.name.message}
          </p>
        )}
      </div>

      <button
        disabled={loading}
        className="rounded-xl bg-violet-600 px-6 py-3 font-semibold transition hover:bg-violet-500 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>

      {message && (
        <p className="text-sm text-green-400">
          {message}
        </p>
      )}
    </form>
  );
}