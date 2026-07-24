import Link from "next/link";
import { User, Settings, LogOut } from "lucide-react";
import useCurrentAdmin from "@/hooks/useCurrentAdmin";
import LogoutButton from "@/components/admin/LogoutButton";

export default function ProfileDropdown() {
  const { admin, loading } = useCurrentAdmin();
  return (
    <div className="w-72">

      {/* Header */}
      <div className="border-b border-zinc-800 p-4">
        <h3 className="font-semibold text-white">
  {loading ? "Loading..." : admin?.name}
</h3>

<p className="text-sm text-zinc-400">
  {loading ? "" : admin?.email}
</p>

<p className="mt-1 text-xs font-medium uppercase tracking-wide text-violet-400">
  {loading ? "" : admin?.role.replace("_", " ")}
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

        <LogoutButton />

      </div>

    </div>
  );
}