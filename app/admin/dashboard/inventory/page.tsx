import InventoryHeader from "@/components/admin/inventory/dashboard/InventoryHeader";
import InventoryStats from "@/components/admin/inventory/dashboard/InventoryStats";
import InventoryTrendChart from "@/components/admin/inventory/dashboard/InventoryTrendChart";
import CategoryStockChart from "@/components/admin/inventory/dashboard/CategoryStockChart";
import LowStockWidget from "@/components/admin/inventory/dashboard/LowStockWidget";
import RecentStockActivity from "@/components/admin/inventory/dashboard/RecentStockActivity";

import { getProductVariantInventory } from "@/lib/actions/inventory/getProductVariantInventory";

export default async function InventoryDashboardPage() {
  const { rows, stats, categoryBreakdown } = await getProductVariantInventory();

  return (
    <div className="space-y-8 p-6">
      <InventoryHeader showManageButton rows={rows} />

      <InventoryStats
        totalSkus={stats.totalSkus}
        totalUnits={stats.totalUnits}
        lowStock={stats.lowStock}
        outOfStock={stats.outOfStock}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <InventoryTrendChart />
        <CategoryStockChart data={categoryBreakdown} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <LowStockWidget rows={rows} />
        <RecentStockActivity />
      </div>
    </div>
  );
}