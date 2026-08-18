"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, ShieldCheck, Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";

import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";
import AccountSidebar from "@/components/account/AccountSidebar";

export default function SecurityPage() {
  const [email, setEmail] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/account/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setEmail(data.user.email);
      })
      .catch(() => {});
  }, []);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all fields.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/account/change-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <AnnouncementBar />
      <Navbar />

      <div className="mx-auto max-w-[1400px] px-6 py-8 md:px-14">
        <div className="mb-8">
          <h1 className="flex items-center gap-2 text-2xl font-black uppercase text-black">
            <ShieldCheck className="h-6 w-6 text-violet-600" />
            Account Security
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage your login email and password.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          <AccountSidebar />

          <div className="space-y-6">
            {/* Account Email */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6">
              <h2 className="mb-4 flex items-center gap-2 font-bold text-black">
                <Mail className="h-4 w-4 text-violet-600" />
                Account Email
              </h2>

              {email ? (
                <p className="text-sm text-zinc-600">{email}</p>
              ) : (
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </div>
              )}
            </div>

            {/* Change Password */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6">
              <h2 className="mb-5 flex items-center gap-2 font-bold text-black">
                <Lock className="h-4 w-4 text-violet-600" />
                Change Password
              </h2>

              <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-zinc-500">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrent ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full rounded-xl border border-zinc-300 px-4 py-3 pr-11 text-sm text-black outline-none focus:border-violet-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
                    >
                      {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-zinc-500">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-xl border border-zinc-300 px-4 py-3 pr-11 text-sm text-black outline-none focus:border-violet-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
                    >
                      {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="mt-1.5 text-xs text-zinc-400">
                    At least 8 characters.
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-zinc-500">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-xl border border-zinc-300 px-4 py-3 pr-11 text-sm text-black outline-none focus:border-violet-500"
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

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-60"
                >
                  {submitting ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              Your password is encrypted and never visible to anyone,
              including ZeroArc staff.
            </div>
          </div>
        </div>
      </div>

      <Newsletter />
      <Footer />
    </main>
  );
}
