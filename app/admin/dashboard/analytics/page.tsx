import PageHeader from "@/components/admin/shared/PageHeader";
import AnalyticsRangeSelector from "@/components/admin/analytics/AnalyticsRangeSelector";
import AnalyticsSummaryCards from "@/components/admin/analytics/AnalyticsSummaryCards";
import RevenueTrendChart from "@/components/admin/analytics/RevenueTrendChart";
import OrdersByStatusChart from "@/components/admin/analytics/OrdersByStatusChart";
import TopProductsList from "@/components/admin/analytics/TopProductsList";
import TopCategoriesChart from "@/components/admin/analytics/TopCategoriesChart";
import PaymentMethodChart from "@/components/admin/analytics/PaymentMethodChart";
import CustomerGrowthChart from "@/components/admin/analytics/CustomerGrowthChart";

import { getAnalytics } from "@/lib/actions/analytics/getAnalytics";

interface Props {
  searchParams: Promise<{ start?: string; end?: string }>;
}

function defaultRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 29);
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

export default async function AnalyticsPage({ searchParams }: Props) {
  const params = await searchParams;
  const fallback = defaultRange();

  const startDate = params.start || fallback.start;
  const endDate = params.end || fallback.end;

  const result = await getAnalytics({ startDate, endDate });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Analytics"
        description="Deep-dive into your store's performance."
      />

      <AnalyticsRangeSelector />

      <AnalyticsSummaryCards
        totalRevenue={result.summary.totalRevenue}
        totalOrders={result.summary.totalOrders}
        avgOrderValue={result.summary.avgOrderValue}
        newCustomersCount={result.summary.newCustomersCount}
      />

      <RevenueTrendChart data={result.revenueTrend} />

      <div className="grid gap-6 lg:grid-cols-2">
        <OrdersByStatusChart data={result.ordersByStatus} />
        <PaymentMethodChart data={result.paymentBreakdown} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TopProductsList data={result.topProducts} />
        <TopCategoriesChart data={result.topCategories} />
      </div>

      <CustomerGrowthChart data={result.customerGrowth} />
    </div>
  );
}