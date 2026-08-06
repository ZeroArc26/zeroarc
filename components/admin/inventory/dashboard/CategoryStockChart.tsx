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
  data: { category: string; units: number }[];
}

export default function CategoryStockChart({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock by Category</CardTitle>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            No stock data yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="units" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}