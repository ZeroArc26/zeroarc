import {
  IndianRupee,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
} from "lucide-react";

import RevenueAnalytics from "@/components/admin/dashboard/RevenueAnalytics";
import RecentOrders from "@/components/admin/dashboard/RecentOrders";
import StatsCard from "@/components/admin/dashboard/StatsCard";
import TopProducts from "@/components/admin/dashboard/TopProducts";
import PageHeader from "@/components/admin/shared/PageHeader";
import LowStockProducts from "@/components/admin/dashboard/LowStockProducts";
import ActivityFeed from "@/components/admin/dashboard/ActivityFeed";
import { getDashboardStats } from "@/lib/actions/dashboard/getDashboardStats";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
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
  value={`₹${stats.revenue}`}
  description="Total Revenue"
  icon={IndianRupee}
  trend="+12.4%"
  trendUp
/>

        <StatsCard
          title="Orders"
          value={stats.orders}
          description="Total Orders"
          icon={ShoppingCart}
          trend="+8.2%"
          trendUp
        />

        <StatsCard
          title="Products"
          value={stats.products}
          description="Products Available"
          icon={Package}
          trend="+4"
          trendUp
        />

        <StatsCard
          title="Customers"
          value={stats.customers}
          description="Registered Users"
          icon={Users}
          trend="+18.7%"
          trendUp
        />

        <StatsCard
  title="Categories"
  value={stats.categories}
  description="Total Categories"
  icon={FolderTree}
  trend="+1"
  trendUp
/>
      </section>

      {/* Analytics + Orders */}
      <section className="grid gap-6 xl:grid-cols-3">
  <div className="space-y-6 xl:col-span-2">
    <RevenueAnalytics />
    <TopProducts products={stats.topProducts} />
  </div>

  <div className="space-y-6">
    <RecentOrders />
    <LowStockProducts
  products={stats.lowStockProducts}
/>
  </div>
</section>

    <ActivityFeed />

    </div>
  );
}