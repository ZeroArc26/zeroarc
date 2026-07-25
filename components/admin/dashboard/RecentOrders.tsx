import Link from "next/link";

import DashboardSection from "@/components/admin/shared/DashboardSection";

const orders = [
  {
    id: "#ZA1025",
    customer: "Rahul Sharma",
    amount: "₹1,299",
    status: "Delivered",
  },
  {
    id: "#ZA1024",
    customer: "Priya Singh",
    amount: "₹899",
    status: "Pending",
  },
  {
    id: "#ZA1023",
    customer: "Aman Kumar",
    amount: "₹2,499",
    status: "Shipped",
  },
  {
    id: "#ZA1022",
    customer: "Neha Verma",
    amount: "₹699",
    status: "Cancelled",
  },
  {
    id: "#ZA1021",
    customer: "Rohit Gupta",
    amount: "₹1,599",
    status: "Delivered",
  },
];

function StatusBadge({ status }: { status: string }) {
  const styles = {
    Delivered: "bg-emerald-500/15 text-emerald-400",
    Pending: "bg-yellow-500/15 text-yellow-400",
    Shipped: "bg-blue-500/15 text-blue-400",
    Cancelled: "bg-red-500/15 text-red-400",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[status as keyof typeof styles]
      }`}
    >
      {status}
    </span>
  );
}

export default function RecentOrders() {
  return (
    <DashboardSection
      title="Recent Orders"
      description="Latest orders from your store."
      action={
        <Link
          href="/admin/orders"
          className="text-sm font-medium text-violet-400 transition hover:text-violet-300"
        >
          View All
        </Link>
      }
    >
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4 transition-all duration-300 hover:border-violet-500/30 hover:bg-zinc-900"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-500/15 text-sm font-semibold text-violet-400">
                {order.customer.charAt(0)}
              </div>

              <div>
                <h3 className="font-medium text-white">
                  {order.customer}
                </h3>

                <p className="text-xs text-zinc-500">
                  {order.id}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold text-white">
                {order.amount}
              </p>

              <div className="mt-2">
                <StatusBadge status={order.status} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardSection>
  );
}