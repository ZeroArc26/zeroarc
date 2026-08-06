"use client";

import Image from "next/image";
import useCurrentAdmin from "@/hooks/useCurrentAdmin";

import ProfileForm from "@/components/admin/profile/ProfileForm";
import ChangePasswordForm from "@/components/admin/profile/ChangePasswordForm";

export default function AdminProfilePage() {
  const { admin, loading } = useCurrentAdmin();

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <p className="text-zinc-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black">My Profile</h1>
        <p className="mt-2 text-zinc-400">
          Manage your account information and security.
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
        <div className="mb-10 flex items-center gap-6">
          <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-violet-600 text-3xl font-bold text-white">
            {admin?.avatar ? (
              <Image src={admin.avatar} alt={admin.name} fill className="object-cover" />
            ) : (
              admin?.name?.charAt(0).toUpperCase()
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              {admin?.name}
            </h2>

            <p className="mt-1 text-zinc-400">
              {admin?.email}
            </p>

            <div className="mt-3 flex items-center gap-3">
              <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-violet-400">
                {admin?.role.replace("_", " ")}
              </span>

              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Active
              </span>
            </div>
          </div>
        </div>

        <ProfileForm />
      </div>

      {/* Change Password */}
      <ChangePasswordForm />
    </div>
  );
}