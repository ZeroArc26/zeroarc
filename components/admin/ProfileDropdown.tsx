import Link from "next/link";
import { User, Settings, LogOut } from "lucide-react";

export default function ProfileDropdown() {
  return (
    <div className="w-72">

      {/* Header */}
      <div className="border-b border-zinc-800 p-4">
        <h3 className="font-semibold text-white">Admin</h3>
        <p className="text-sm text-zinc-400">
          admin@zeroarc.in
        </p>
      </div>

      {/* Menu */}
      <div className="p-2">

        <Link
          href="/admin/profile"
          className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-zinc-800"
        >
          <User size={18} />
          <span>My Profile</span>
        </Link>

        <Link
          href="/admin/settings"
          className="mt-1 flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-zinc-800"
        >
          <Settings size={18} />
          <span>Account Settings</span>
        </Link>

        <button
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 transition hover:bg-red-500/10"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>

      </div>

    </div>
  );
}