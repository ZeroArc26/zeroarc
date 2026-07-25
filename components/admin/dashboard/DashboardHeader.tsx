import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";

export default function DashboardHeader() {
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 17
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      {/* Left */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-400" />

          <span className="text-sm font-medium text-violet-400">
            ZeroArc Admin
          </span>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-white">
          {greeting} 👋
        </h1>

        <p className="mt-3 max-w-2xl text-zinc-400">
          Welcome back. Here's what's happening with your store today.
        </p>
      </div>

      {/* Right */}
      <Link
        href="/admin/products/new"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-6 font-semibold text-white transition-all duration-200 hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-600/20"
      >
        <Plus className="h-5 w-5" />

        Add Product
      </Link>
    </div>
  );
}