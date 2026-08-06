import Link from "next/link";

import DashboardSection from "@/components/admin/shared/DashboardSection";
import { getRecentOrders } from "@/lib/actions/dashboard/getRecentOrders";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-400",
  confirmed: "bg-blue-500/15 text-blue-400",
  processing: "bg-blue-500/15 text-blue-400",
  shipped: "bg-violet-500/15 text-violet-400",
  delivered: "bg-emerald-500/15 text-emerald-400",
  cancelled: "bg-red-500/15 text-red-400",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
        STATUS_STYLES[status] ?? "bg-zinc-500/15 text-zinc-400"
      }`}
    >
      {status}
    </span>
  );
}

export default async function RecentOrders() {
  const orders = await getRecentOrders();

  return (
    <DashboardSection
      title="Recent Orders"
      description="Latest orders from your store."
      action={
        <Link
          href="/admin/dashboard/orders"
          className="text-sm font-medium text-violet-400 transition hover:text-violet-300"
        >
          View All
        </Link>
      }
    >
      {orders.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-500">
          No orders yet.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4 transition-all duration-300 hover:border-violet-500/30 hover:bg-zinc-900"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-500/15 text-sm font-semibold text-violet-400">
                  {order.customer.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h3 className="font-medium text-white">
                    {order.customer}
                  </h3>

                  <p className="text-xs text-zinc-500">{order.id}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold text-white">
                  ₹{order.amount.toLocaleString("en-IN")}
                </p>

                <div className="mt-2">
                  <StatusBadge status={order.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardSection>
  );
}