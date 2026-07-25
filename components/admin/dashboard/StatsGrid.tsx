import {
  IndianRupee,
  ShoppingCart,
  Package,
  Users,
} from "lucide-react";

import StatsCard from "./StatsCard";

export default function StatsGrid() {
  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Revenue"
        value="₹0"
        description="Total Revenue"
        icon={IndianRupee}
        trend="+0%"
        trendUp
      />

      <StatsCard
        title="Orders"
        value="0"
        description="Total Orders"
        icon={ShoppingCart}
        trend="+0%"
        trendUp
      />

      <StatsCard
        title="Products"
        value="0"
        description="Products Available"
        icon={Package}
        trend="+0%"
        trendUp
      />

      <StatsCard
        title="Customers"
        value="0"
        description="Registered Users"
        icon={Users}
        trend="+0%"
        trendUp
      />
    </section>
  );
}