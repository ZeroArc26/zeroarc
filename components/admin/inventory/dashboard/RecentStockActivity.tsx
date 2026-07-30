"use client";

import {
  ArrowDown,
  ArrowUp,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

const activities = [
  {
    id: 1,
    product: "Shadow Ronin",
    action: "Restocked",
    quantity: "+20",
    admin: "Admin",
    time: "2 min ago",
    icon: ArrowUp,
    color: "text-green-600",
  },
  {
    id: 2,
    product: "Violet Void",
    action: "Order Placed",
    quantity: "-3",
    admin: "System",
    time: "15 min ago",
    icon: ArrowDown,
    color: "text-red-600",
  },
  {
    id: 3,
    product: "Crimson Eclipse",
    action: "Customer Return",
    quantity: "+1",
    admin: "System",
    time: "1 hour ago",
    icon: RotateCcw,
    color: "text-blue-600",
  },
  {
    id: 4,
    product: "Night Reaper",
    action: "Damaged Stock",
    quantity: "-2",
    admin: "Admin",
    time: "Today",
    icon: AlertTriangle,
    color: "text-yellow-600",
  },
];

export default function RecentStockActivity() {
  return (
    <Card>

      <CardHeader>

        <CardTitle>
          Recent Stock Activity
        </CardTitle>

      </CardHeader>

      <CardContent className="space-y-4">
                {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div
              key={activity.id}
              className="flex items-center justify-between rounded-xl border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full bg-muted ${activity.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-semibold">
                    {activity.product}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {activity.action}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {activity.admin} • {activity.time}
                  </p>
                </div>
              </div>

              <Badge
                variant="outline"
                className={`font-semibold ${activity.color}`}
              >
                {activity.quantity}
              </Badge>
            </div>
          );
        })}

        {activities.length === 0 && (
          <div className="flex h-40 flex-col items-center justify-center text-center">
            <AlertTriangle className="mb-3 h-10 w-10 text-muted-foreground" />

            <h3 className="font-semibold">
              No Recent Activity
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Stock movements will appear here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}