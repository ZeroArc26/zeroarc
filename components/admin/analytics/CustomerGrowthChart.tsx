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
  data: { date: string; newCustomers: number }[];
}

export default function CustomerGrowthChart({ data }: Props) {
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    }),
  }));

  return (
    <Card className="border-zinc-800 bg-zinc-900/40">
      <CardHeader>
        <CardTitle className="text-white">New Customers</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formatted}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#a1a1aa" }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#a1a1aa" }} />
              <Tooltip
                contentStyle={{
                  background: "#18181b",
                  border: "1px solid #3f3f46",
                  borderRadius: 8,
                  color: "#fff",
                }}
              />
              <Bar dataKey="newCustomers" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}