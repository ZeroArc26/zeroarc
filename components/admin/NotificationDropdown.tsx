export default function NotificationDropdown() {
  return (
    <div className="p-4">

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">
          Notifications
        </h2>

        <span className="rounded-full bg-violet-600 px-2 py-1 text-xs">
          4
        </span>
      </div>

      <div className="space-y-2">

        <button className="w-full rounded-xl p-3 text-left transition hover:bg-zinc-800">
          🛒 <span className="font-semibold">New Order</span>

          <p className="mt-1 text-sm text-zinc-400">
            Order #ZA1024 received
          </p>
        </button>

        <button className="w-full rounded-xl p-3 text-left transition hover:bg-zinc-800">
          ⚠ <span className="font-semibold">Low Stock</span>

          <p className="mt-1 text-sm text-zinc-400">
            Arc Oversized Tee
          </p>
        </button>

        <button className="w-full rounded-xl p-3 text-left transition hover:bg-zinc-800">
          👤 <span className="font-semibold">New Customer</span>

          <p className="mt-1 text-sm text-zinc-400">
            Rahul joined ZeroArc
          </p>
        </button>

      </div>

      <button className="mt-4 w-full rounded-xl border border-zinc-700 py-3 transition hover:border-violet-500">
        View All
      </button>

    </div>
  );
}