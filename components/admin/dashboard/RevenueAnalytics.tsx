"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import DashboardSection from "@/components/admin/shared/DashboardSection";

interface RevenueAnalyticsProps {
  data: { name: string; revenue: number }[];
  totalRevenue: number;
}

export default function RevenueAnalytics({
  data,
  totalRevenue,
}: RevenueAnalyticsProps) {
  return (
    <DashboardSection
      title="Revenue Analytics"
      description="Track your revenue over the last 7 days."
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-400">Total Revenue (7 days)</p>

          <h2 className="mt-2 text-4xl font-bold text-white">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </h2>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="revenueGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#8B5CF6"
                  stopOpacity={0.45}
                />

                <stop
                  offset="95%"
                  stopColor="#8B5CF6"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272A"
            />

            <XAxis
              dataKey="name"
              tick={{ fill: "#A1A1AA", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                background: "#18181B",
                border: "1px solid #27272A",
                borderRadius: 12,
                color: "#fff",
              }}
              formatter={(value: any) => [`₹${Number(value).toLocaleString("en-IN")}`, "Revenue"]}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#8B5CF6"
              strokeWidth={3}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </DashboardSection>
  );
}