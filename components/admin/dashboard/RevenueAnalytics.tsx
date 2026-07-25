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

const revenueData = [
  { name: "Mon", revenue: 4200 },
  { name: "Tue", revenue: 5800 },
  { name: "Wed", revenue: 4900 },
  { name: "Thu", revenue: 7200 },
  { name: "Fri", revenue: 6800 },
  { name: "Sat", revenue: 9100 },
  { name: "Sun", revenue: 8400 },
];

export default function RevenueAnalytics() {
  return (
    <DashboardSection
      title="Revenue Analytics"
      description="Track your revenue over the last 7 days."
      action={
        <select className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 outline-none">
          <option>7 Days</option>
          <option>30 Days</option>
          <option>90 Days</option>
        </select>
      }
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-400">Total Revenue</p>

          <h2 className="mt-2 text-4xl font-bold text-white">
            ₹84,250
          </h2>

          <p className="mt-2 text-sm font-medium text-emerald-400">
            ▲ +12.4% from last week
          </p>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueData}>
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