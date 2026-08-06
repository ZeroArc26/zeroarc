"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  data: { category: string; revenue: number }[];
}

export default function TopCategoriesChart({ data }: Props) {
  return (
    <Card className="border-zinc-800 bg-zinc-900/40">
      <CardHeader>
        <CardTitle className="text-white">Revenue by Category</CardTitle>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-zinc-500">
            No sales in this range.
          </div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: "#a1a1aa" }} />
                <YAxis
                  type="category"
                  dataKey="category"
                  tick={{ fontSize: 12, fill: "#a1a1aa" }}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    background: "#18181b",
                    border: "1px solid #3f3f46",
                    borderRadius: 8,
                    color: "#fff",
                  }}
                />
                <Bar dataKey="revenue" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}