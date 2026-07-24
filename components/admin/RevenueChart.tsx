"use client";

import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", revenue: 1200 },
  { day: "Tue", revenue: 2400 },
  { day: "Wed", revenue: 1800 },
  { day: "Thu", revenue: 3100 },
  { day: "Fri", revenue: 2800 },
  { day: "Sat", revenue: 4300 },
  { day: "Sun", revenue: 3900 },
];

export default function RevenueChart() {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">
          Revenue Overview
        </h2>

        <p className="text-zinc-500">
          Last 7 Days
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="colorRevenue"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
              </linearGradient>
            </defs>

            <XAxis
              dataKey="day"
              stroke="#71717A"
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#8B5CF6"
              strokeWidth={4}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}