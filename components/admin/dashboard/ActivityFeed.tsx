import { Package, ShoppingCart } from "lucide-react";

import DashboardSection from "@/components/admin/shared/DashboardSection";
import { getRecentActivity } from "@/lib/actions/dashboard/getRecentActivity";

const ICONS = {
  order: ShoppingCart,
  product: Package,
};

export default async function ActivityFeed() {
  const activities = await getRecentActivity();

  return (
    <DashboardSection
      title="Recent Activity"
      description="Latest updates from your store."
    >
      {activities.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-500">
          No recent activity yet.
        </p>
      ) : (
        <div className="space-y-5">
          {activities.map((activity, i) => {
            const Icon = ICONS[activity.type];

            return (
              <div
                key={i}
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

                <span className="whitespace-nowrap text-xs text-zinc-500">
                  {activity.time}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </DashboardSection>
  );
}