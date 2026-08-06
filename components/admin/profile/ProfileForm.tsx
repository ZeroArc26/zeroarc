"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";

import useCurrentAdmin from "@/hooks/useCurrentAdmin";

import {
  updateAdminProfileSchema,
  UpdateAdminProfileInput,
} from "@/lib/validations/admin-profile";

export default function ProfileForm() {
  const { admin } = useCurrentAdmin();

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateAdminProfileInput>({
    resolver: zodResolver(updateAdminProfileSchema),
  });

  useEffect(() => {
    if (admin) {
      reset({
        name: admin.name,
        avatar: admin.avatar || "",
      });
      setAvatarUrl(admin.avatar || "");
    }
  }, [admin, reset]);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "avatars");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        setMessage("Failed to upload avatar.");
        return;
      }

      setAvatarUrl(data.url);
      setValue("avatar", data.url, { shouldDirty: true });
    } catch (error) {
      console.error(error);
      setMessage("Failed to upload avatar.");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(values: UpdateAdminProfileInput) {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, avatar: avatarUrl }),
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="mb-2 block text-sm text-zinc-400">
          Profile Photo
        </label>

        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-zinc-700 bg-zinc-800">
            {avatarUrl ? (
              <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-violet-400">
                {admin?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-violet-500">
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
            {uploading ? "Uploading..." : "Change Photo"}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-400">Name</label>

        <input
          {...register("name")}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3"
        />

        {errors.name && (
          <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <button
        disabled={loading || uploading}
        className="rounded-xl bg-violet-600 px-6 py-3 font-semibold transition hover:bg-violet-500 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>

      {message && <p className="text-sm text-green-400">{message}</p>}
    </form>
  );
}