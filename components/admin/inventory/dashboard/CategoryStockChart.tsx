"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const data = [
  {
    name: "Anime",
    value: 420,
  },
  {
    name: "Oversized",
    value: 280,
  },
  {
    name: "Minimal",
    value: 180,
  },
  {
    name: "Limited",
    value: 120,
  },
];

const COLORS = [
  "#7C3AED",
  "#A855F7",
  "#C084FC",
  "#DDD6FE",
];

export default function CategoryStockChart() {
  return (
    <Card>

      <CardHeader>

        <CardTitle>
          Category Distribution
        </CardTitle>

      </CardHeader>

      <CardContent className="h-[350px]">

                <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={4}
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {data.map((item, index) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor:
                      COLORS[index % COLORS.length],
                  }}
                />

                <span className="text-sm font-medium">
                  {item.name}
                </span>
              </div>

              <span className="text-sm text-muted-foreground">
                {item.value}
              </span>
            </div>
          ))}
        </div>

      </CardContent>
    </Card>
  );
}