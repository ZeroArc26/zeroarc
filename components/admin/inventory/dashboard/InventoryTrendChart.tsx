"use client";

import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const data = [
  { day: "Mon", stockIn: 80, stockOut: 42 },
  { day: "Tue", stockIn: 60, stockOut: 35 },
  { day: "Wed", stockIn: 95, stockOut: 61 },
  { day: "Thu", stockIn: 72, stockOut: 38 },
  { day: "Fri", stockIn: 110, stockOut: 74 },
  { day: "Sat", stockIn: 87, stockOut: 53 },
  { day: "Sun", stockIn: 65, stockOut: 28 },
];

export default function InventoryTrendChart() {
  return (
    <Card>

      <CardHeader>

        <CardTitle>
          Inventory Trend
        </CardTitle>

      </CardHeader>

      <CardContent className="h-[350px]">

                <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-muted"
            />

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="stockIn"
              name="Stock In"
              stroke="#7C3AED"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />

            <Line
              type="monotone"
              dataKey="stockOut"
              name="Stock Out"
              stroke="#EF4444"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}