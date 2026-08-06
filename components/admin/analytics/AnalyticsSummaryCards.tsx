import { IndianRupee, ShoppingCart, TrendingUp, UserPlus } from "lucide-react";

interface Props {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  newCustomersCount: number;
}

export default function AnalyticsSummaryCards({
  totalRevenue,
  totalOrders,
  avgOrderValue,
  newCustomersCount,
}: Props) {
  const cards = [
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
    },
    {
      title: "Total Orders",
      value: totalOrders.toLocaleString("en-IN"),
      icon: ShoppingCart,
    },
    {
      title: "Avg. Order Value",
      value: `₹${Math.round(avgOrderValue).toLocaleString("en-IN")}`,
      icon: TrendingUp,
    },
    {
      title: "New Customers",
      value: newCustomersCount.toLocaleString("en-IN"),
      icon: UserPlus,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ title, value, icon: Icon }) => (
        <div
          key={title}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
            <Icon className="h-5 w-5 text-violet-400" />
          </div>
          <p className="mt-4 text-2xl font-bold text-white">{value}</p>
          <p className="text-sm text-zinc-500">{title}</p>
        </div>
      ))}
    </div>
  );
}