"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface RevenueChartProps {
  data: {
    month: string;
    revenue: number;
  }[];
}

export default function RevenueChart({
  data,
}: RevenueChartProps) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

      <h2 className="mb-8 text-3xl font-black">
        Revenue Analytics
      </h2>

      <div className="h-[350px]">

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
                <stop
                  offset="5%"
                  stopColor="#8B5CF6"
                  stopOpacity={0.8}
                />

                <stop
                  offset="95%"
                  stopColor="#8B5CF6"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            <CartesianGrid
              stroke="#27272A"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="month"
              stroke="#A1A1AA"
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#8B5CF6"
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}