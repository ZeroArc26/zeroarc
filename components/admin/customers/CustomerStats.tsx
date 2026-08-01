import {
  Users,
  UserPlus,
  Repeat,
  IndianRupee,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CustomerStatsProps {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  totalRevenue: number;
}

export default function CustomerStats({
  totalCustomers,
  newCustomers,
  returningCustomers,
  totalRevenue,
}: CustomerStatsProps) {
  const stats = [
    {
      title: "Total Customers",
      value: totalCustomers.toLocaleString(),
      icon: Users,
    },
    {
      title: "New Customers",
      value: newCustomers.toLocaleString(),
      icon: UserPlus,
    },
    {
      title: "Returning Customers",
      value: returningCustomers.toLocaleString(),
      icon: Repeat,
    },
    {
      title: "Customer Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>

              <Icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}