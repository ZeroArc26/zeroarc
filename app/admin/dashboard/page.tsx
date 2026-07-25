import {
  IndianRupee,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

import RevenueAnalytics from "@/components/admin/dashboard/RevenueAnalytics";
import RecentOrders from "@/components/admin/dashboard/RecentOrders";
import StatsCard from "@/components/admin/dashboard/StatsCard";
import TopProducts from "@/components/admin/dashboard/TopProducts";
import PageHeader from "@/components/admin/shared/PageHeader";
import LowStockProducts from "@/components/admin/dashboard/LowStockProducts";
import ActivityFeed from "@/components/admin/dashboard/ActivityFeed";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening today."
      />

      {/* Stats Cards */}
      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Revenue"
          value="₹84,250"
          description="Total Revenue"
          icon={IndianRupee}
          trend="+12.4%"
          trendUp
        />

        <StatsCard
          title="Orders"
          value={156}
          description="Total Orders"
          icon={ShoppingCart}
          trend="+8.2%"
          trendUp
        />

        <StatsCard
          title="Products"
          value={48}
          description="Products Available"
          icon={Package}
          trend="+4"
          trendUp
        />

        <StatsCard
          title="Customers"
          value={1294}
          description="Registered Users"
          icon={Users}
          trend="+18.7%"
          trendUp
        />
      </section>

      {/* Analytics + Orders */}
      <section className="grid gap-6 xl:grid-cols-3">
  <div className="space-y-6 xl:col-span-2">
    <RevenueAnalytics />
    <TopProducts />
  </div>

  <div className="space-y-6">
    <RecentOrders />
    <LowStockProducts />
  </div>
</section>

    <ActivityFeed />

    </div>
  );
}