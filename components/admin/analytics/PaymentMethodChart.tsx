"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ["#8b5cf6", "#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#a1a1aa"];

interface Props {
  data: { method: string; count: number; revenue: number }[];
}

export default function PaymentMethodChart({ data }: Props) {
  const formatted = data.map((d) => ({ name: d.method, value: d.revenue }));

  return (
    <Card className="border-zinc-800 bg-zinc-900/40">
      <CardHeader>
        <CardTitle className="text-white">Payment Method Split</CardTitle>
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
                  {formatted.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`}
                  contentStyle={{
                    background: "#18181b",
                    border: "1px solid #3f3f46",
                    borderRadius: 8,
                    color: "#fff",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: "#a1a1aa" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}