import {
  Package,
  ShoppingCart,
  Star,
  UserPlus,
} from "lucide-react";

import DashboardSection from "@/components/admin/shared/DashboardSection";

const activities = [
  {
    id: 1,
    icon: ShoppingCart,
    title: "New order received",
    description: "Order #ZA1026 placed by Rahul Sharma",
    time: "2 min ago",
  },
  {
    id: 2,
    icon: UserPlus,
    title: "New customer joined",
    description: "Aman Kumar created an account",
    time: "15 min ago",
  },
  {
    id: 3,
    icon: Package,
    title: "Product updated",
    description: "Naruto Hoodie inventory updated",
    time: "1 hour ago",
  },
  {
    id: 4,
    icon: Star,
    title: "New review added",
    description: "5★ review for ZeroArc Oversized Tee",
    time: "3 hours ago",
  },
];

export default function ActivityFeed() {
  return (
    <DashboardSection
      title="Recent Activity"
      description="Latest updates from your store."
    >
      <div className="space-y-5">
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4 transition-all duration-300 hover:border-violet-500/30 hover:bg-zinc-900"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
                <Icon className="h-5 w-5 text-violet-400" />
              </div>

              <div className="flex-1">
                <h3 className="font-medium text-white">
                  {activity.title}
                </h3>

                <p className="mt-1 text-sm text-zinc-400">
                  {activity.description}
                </p>
              </div>

              <span className="text-xs text-zinc-500 whitespace-nowrap">
                {activity.time}
              </span>
            </div>
          );
        })}
      </div>
    </DashboardSection>
  );
}