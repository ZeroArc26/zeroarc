import InventoryHeader from "@/components/admin/inventory/dashboard/InventoryHeader";
import InventoryListClient from "@/components/admin/inventory/table/InventoryListClient";

import { getProductVariantInventory } from "@/lib/actions/inventory/getProductVariantInventory";

export default async function InventoryListPage() {
  const { rows } = await getProductVariantInventory();

  return (
    <div className="space-y-6 p-6">
      <InventoryHeader showManageButton={false} rows={rows} />
      <InventoryListClient rows={rows} />
    </div>
  );
}