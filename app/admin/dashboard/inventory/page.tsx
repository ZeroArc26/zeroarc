import InventoryHeader from "@/components/admin/inventory/dashboard/InventoryHeader";
import InventoryStats from "@/components/admin/inventory/dashboard/InventoryStats";
import InventoryTrendChart from "@/components/admin/inventory/dashboard/InventoryTrendChart";
import CategoryStockChart from "@/components/admin/inventory/dashboard/CategoryStockChart";
import LowStockWidget from "@/components/admin/inventory/dashboard/LowStockWidget";
import RecentStockActivity from "@/components/admin/inventory/dashboard/RecentStockActivity";

export default function InventoryDashboardPage() {
  const inventoryStats = {
    totalSkus: 325,
    totalUnits: 12846,
    lowStock: 8,
    outOfStock: 3,
  };

  return (
    <div className="space-y-8 p-6">
      <InventoryHeader showManageButton />

      <InventoryStats
        totalSkus={inventoryStats.totalSkus}
        totalUnits={inventoryStats.totalUnits}
        lowStock={inventoryStats.lowStock}
        outOfStock={inventoryStats.outOfStock}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <InventoryTrendChart />
        <CategoryStockChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <LowStockWidget />
        <RecentStockActivity />
      </div>
    </div>
  );
}