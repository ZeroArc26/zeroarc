"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { statusLabel } from "@/lib/orderStatus";

const COLORS: Record<string, string> = {
  pending: "#a1a1aa",
  confirmed: "#f59e0b",
  processing: "#f59e0b",
  shipped: "#8b5cf6",
  delivered: "#10b981",
  cancelled: "#ef4444",
};

interface Props {
  data: { status: string; count: number }[];
}

export default function OrdersByStatusChart({ data }: Props) {
  const formatted = data.map((d) => ({
    name: statusLabel(d.status),
    value: d.count,
    color: COLORS[d.status] || "#71717a",
  }));

  return (
    <Card className="border-zinc-800 bg-zinc-900/40">
      <CardHeader>
        <CardTitle className="text-white">Orders by Status</CardTitle>
      </CardHeader>

      <CardContent>
        {formatted.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-zinc-500">
            No orders in this range.
          </div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formatted}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {formatted.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#18181b",
                    border: "1px solid #3f3f46",
                    borderRadius: 8,
                    color: "#fff",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12, color: "#a1a1aa" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}