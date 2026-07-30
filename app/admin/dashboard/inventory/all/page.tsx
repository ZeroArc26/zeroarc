import { getInventory } from "@/lib/actions/inventory/getInventory";

import InventoryHeader from "@/components/admin/inventory/dashboard/InventoryHeader";
import InventoryTable from "@/components/admin/inventory/table/InventoryTable";
import InventoryTableToolbar from "@/components/admin/inventory/table/InventoryTableToolbar";

export default async function InventoryListPage() {
  const result = await getInventory();

  const inventory = result.success ? result.data : [];

  return (
    <div className="space-y-6 p-6">
      <InventoryHeader showManageButton={false} />

      <InventoryTableToolbar />

      <InventoryTable inventory={inventory} />
    </div>
  );
}