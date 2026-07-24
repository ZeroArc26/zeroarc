"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/auth/logout", {
        method: "POST",
      });

      const data = await res.json();

      if (data.success) {
        router.replace("/admin/login");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to logout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
    >
      <LogOut size={18} />
      <span>{loading ? "Logging out..." : "Logout"}</span>
    </button>
  );
}